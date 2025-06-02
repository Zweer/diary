#!/usr/bin/env ruby

require 'find'
require 'pathname'

OUTPUT_FILENAME = "docs/EXPORT.md"

EXCLUDE_PATTERNS = [
  /^\.git\//,
  /^\.vscode\//,
  /^_site\//,
  /^vendor\/bundle\//,
  /^node_modules\//,
  OUTPUT_FILENAME,
  /\.DS_Store$/,
  /\.jekyll-cache\//,
  /^assets\/img\//,
  /^Gemfile.lock$/,
]

LANGUAGE_MAP = {
  '.rb' => 'ruby',
  '.js' => 'javascript',
  '.html' => 'html',
  '.htm' => 'html',
  '.css' => 'css',
  '.scss' => 'scss',
  '.sass' => 'sass',
  '.yml' => 'yaml',
  '.yaml' => 'yaml',
  '.json' => 'json',
  '.xml' => 'xml',
  '.md' => 'markdown',
  '.markdown' => 'markdown',
  '.sh' => 'shell',
  '.txt' => 'text',
  '.liquid' => 'liquid',
  '.conf' => 'plaintext',
  '' => 'plaintext',
}

repo_root = Pathname.new(Dir.pwd)
output_file_path = repo_root.join(OUTPUT_FILENAME)

puts "Starting export in '#{OUTPUT_FILENAME}'..."

File.open(output_file_path, "w") do |output_file|
  output_file.puts "# EXPORT\n"
  output_file.puts "Generated on: #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
  output_file.puts "\n---\n\n"
  output_file.puts "## File export\n"

  Find.find(repo_root) do |path_str|
    path = Pathname.new(path_str)
    relative_path_str = path.relative_path_from(repo_root).to_s

    next if path == repo_root

    should_exclude = EXCLUDE_PATTERNS.any? do |pattern|
      if pattern.is_a?(Regexp)
        pattern.match?(relative_path_str)
      else
        relative_path_str.start_with?(pattern.to_s) || relative_path_str == pattern.to_s
      end
    end

    if should_exclude
      Find.prune if path.directory?
      next
    end

    if path.file?
      puts "Processing: #{relative_path_str}"
      output_file.puts "\n### File: `#{relative_path_str}`\n\n"

      ext = path.extname.downcase
      lang = LANGUAGE_MAP[ext] || LANGUAGE_MAP[''] # Fallback a plaintext

      begin
        content = File.read(path, mode: 'rb', encoding: 'UTF-8')
      rescue Errno::EACCES
        content = "Error: no permission to access file"
        content = "<!-- #{content} -->"
      rescue => e
        content = "Error while reading file: #{e.message}"
        content = "<!-- #{content} -->"
      end

      max_consecutive_backticks = 0
      if content && !content.empty?
        content.scan(/`+/) do |match|
          max_consecutive_backticks = [max_consecutive_backticks, match.length].max
        end
      end

      num_delimit_backticks = [max_consecutive_backticks + 1, 3].max
      delimiter = '`' * num_delimit_backticks

      output_file.puts "#{delimiter}#{lang}"
      output_file.puts content
      output_file.puts delimiter
      output_file.puts "\n"
    end
  end
end

puts "\nExport completed!"
puts "Export file saved in: '#{output_file_path}'"
