/**
 * Simple calendar for diary - no conflicts with CSS styling
 * Created 2025
 */

class SimpleCalendar {
  constructor(posts, activePost) {
    this.posts = posts.map((post) => ({
      ...post,
      date: new Date(post.date),
      dateString: this.formatDate(new Date(post.date)),
    }));
    
    this.activePost = activePost;
    this.currentDate = new Date();
    
    this.calendarEl = document.getElementById('calendar');
    this.openBtn = document.getElementById('calendar-open-btn');
    this.closeBtn = document.getElementById('calendar-close-btn');
    
    this.setupEventListeners();
    this.updateMonthsWithPosts();
    
    // Initialize calendar to current month/year
    this.showMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
  }
  
  formatDate(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
  
  setupEventListeners() {
    // Toggle calendar visibility
    if (this.openBtn && this.calendarEl) {
      this.openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.calendarEl.style.display = 'block';
      });
    }
    
    if (this.closeBtn && this.calendarEl) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.calendarEl.style.display = 'none';
      });
    }
    
    // Month navigation
    const monthLinks = document.querySelectorAll('#calendar-months li');
    monthLinks.forEach((monthEl) => {
      monthEl.addEventListener('click', () => {
        const monthIndex = parseInt(monthEl.getAttribute('title'), 10);
        if (!isNaN(monthIndex)) {
          this.showMonth(this.currentDate.getFullYear(), monthIndex);
        }
      });
    });
    
    // Year navigation
    const prevYear = document.getElementById('calendar-prev-year');
    const nextYear = document.getElementById('calendar-next-year');
    const yearLabel = document.querySelector('#calendar-year .now');
    
    if (prevYear) {
      prevYear.addEventListener('click', () => {
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        this.showMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
        if (yearLabel) yearLabel.textContent = this.currentDate.getFullYear();
        this.updateMonthsWithPosts();
      });
    }
    
    if (nextYear) {
      nextYear.addEventListener('click', () => {
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        this.showMonth(this.currentDate.getFullYear(), this.currentDate.getMonth());
        if (yearLabel) yearLabel.textContent = this.currentDate.getFullYear();
        this.updateMonthsWithPosts();
      });
    }
  }
  
  updateMonthsWithPosts() {
    const year = this.currentDate.getFullYear();
    const monthElements = document.querySelectorAll('#calendar-months li');
    
    monthElements.forEach((monthEl) => {
      monthEl.classList.remove('month-has-posts');
      const monthIndex = parseInt(monthEl.getAttribute('title'), 10);
      
      if (!isNaN(monthIndex)) {
        const hasPost = this.posts.some(post => 
          post.date.getFullYear() === year && 
          post.date.getMonth() === monthIndex
        );
        
        if (hasPost) {
          monthEl.classList.add('month-has-posts');
        }
      }
    });
  }
  
  showMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() || 7) - 1));
    
    const dayElements = document.querySelectorAll('.calendar-day');
    const currentDate = new Date(startDate);
    
    dayElements.forEach((dayEl) => {
      const day = currentDate.getDate();
      const dateString = this.formatDate(currentDate);
      const post = this.posts.find(p => p.dateString === dateString);
      
      dayEl.setAttribute('id', dateString);
      dayEl.className = 'calendar-day';
      
      if (currentDate.getMonth() !== month) {
        dayEl.classList.add('outmonth');
      }
      
      if (post) {
        dayEl.innerHTML = `<a href="${post.url}">${day}</a>`;
        if (post.excerpt) {
          dayEl.title = post.excerpt;
        }
      } else {
        dayEl.textContent = day;
        dayEl.title = '';
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    });
    
    // Update current month highlight
    document.querySelectorAll('#calendar-months li').forEach((el, idx) => {
      el.classList.toggle('calendar-months__now', idx === month);
    });
  }
}

// Initialize when DOM is ready
if (typeof posts !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SimpleCalendar(posts, activePost);
    });
  } else {
    new SimpleCalendar(posts, activePost);
  }
}