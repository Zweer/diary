/**
 * Original by soyaine on 2016/12/3.
 * Last update: 2019/08/08
 * Modernized in 2025.
 */

class Calendar {
  static formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  get dateElements() {
    return document.getElementsByClassName('calendar-day');
  }

  get calendarElement() {
    return document.getElementById('calendar');
  }

  get paperBackground() {
    return document.getElementById('paper-before');
  }

  get closeButton() {
    return document.getElementById('calendar-close-btn');
  }

  get openButton() {
    return document.getElementById('calendar-open-btn');
  }

  get prevYearButton() {
    return document.getElementById('calendar-prev-year');
  }

  get nextYearButton() {
    return document.getElementById('calendar-next-year');
  }

  get yearElement() {
    return document.getElementById('calendar-year');
  }

  get monthDisplayElement() {
    return document.getElementById('calendar-months');
  }

  get ribbonElement() {
    return document.getElementById('ribbon');
  }

  constructor(posts, activePost) {
    this.posts = posts.map((post) => ({
      ...post,
      date: new Date(post.date),
      dateString: Calendar.formatDate(post.date),
    }));
    this.post = this.posts.find((post) => post.id === activePost);

    this.date = new Date(this.post?.date ?? Date.now());

    this.today = new Date();

    this.renderedDays = [];

    this.setupToggleEvents();
    this.buildRibbon();
    this.initialize();
    this.setupNavigation();
  }

  setupToggleEvents() {
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        if (this.calendarElement) {
          this.calendarElement.style.display = 'none';
        }
        if (this.paperBackground) {
          this.paperBackground.style.backgroundColor = '#fff';
        }
      }, false);
    }

    if (this.openButton) {
      this.openButton.addEventListener('click', () => {
        if (this.calendarElement) {
          this.calendarElement.style.display = 'block';
        }
        if (this.paperBackground) {
          this.paperBackground.style.backgroundColor = 'rgb(252, 143, 150)';
        }
      }, false);
    }
  }

  setupNavigation() {
    if (this.monthDisplayElement) {
      this.monthDisplayElement.addEventListener('click', (event) => {
        const targetListItem = event.target.closest('li');
        if (targetListItem && targetListItem.getAttribute('title') !== null) {
          const monthIndex = parseInt(targetListItem.getAttribute('title'), 10);
          this.switchMonthYear(this.date.getFullYear(), monthIndex);
        }
      });
    }

    if (this.prevYearButton) {
      this.prevYearButton.addEventListener('click', () => {
        this.switchMonthYear(this.date.getFullYear() - 1, this.date.getMonth());
      });
    }

    if (this.nextYearButton) {
      this.nextYearButton.addEventListener('click', () => {
        this.switchMonthYear(this.date.getFullYear() + 1, this.date.getMonth());
      });
    }
  }

  switchMonthYear(year, monthIndex) {
    const nowElement = document.getElementsByClassName('call-day now');
    if (nowElement.length && nowElement[0]) {
      nowElement[0].classList.remove('now');
    }

    this.date.setFullYear(year);
    this.date.setMonth(monthIndex);
    this.date.setDate(1);

    this.initialize();
  }

  initialize() {
    this.prepareRenderData();
    this.renderCalendarGrid();
    this.highlightMonthsWithPosts();
  }

  prepareRenderData() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const dayOfWeek = firstDayOfMonth.getDay() || 7;
    const calendarGridStartDate = new Date(year, month, 1 - (dayOfWeek - 1));

    const renderedDays = [];
    const tmpDate = new Date(calendarGridStartDate);

    for (let i = 0; i < 42; i++) {
      renderedDays.push({
        date: new Date(tmpDate),
        dateString: Calendar.formatDate(tmpDate),
      });
      tmpDate.setDate(tmpDate.getDate() + 1);
    }

    this.renderedDays = renderedDays;
  }

  renderCalendarGrid() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const nowString = Calendar.formatDate(this.date);

    this.renderedDays.forEach(({ date, dateString }, index) => {
      if (!this.dateElements[index]) {
        return;
      }

      const dateElement = this.dateElements[index];
      dateElement.setAttribute('id', dateString);
      dateElement.className = 'calendar-day';
      dateElement.innerHTML = '';

      const dateMonth = date.getMonth();
      const post = this.posts.find((post) => post.dateString === dateString);
      if (post) {
        dateElement.innerHTML = `<a href="${post.url}">${date.getDate()}</a>`;

        if (post.excerpt) {
          dateElement.title = post.excerpt;
        }
      } else {
        dateElement.innerText = date.getDate();
      }

      if (dateString === nowString) {
        dateElement.classList.add('now');
      }

      if (dateMonth !== month) {
        dateElement.classList.add('outmonth');
      }
    });

    if (this.yearElement && this.yearElement.children[1]) {
      this.yearElement.children[1].innerText = year;
    }
    if (this.monthDisplayElement) {
      const currentMonthClass = 'calendar-months__now';
      const currentMonthElement = this.monthDisplayElement.querySelector(`.${currentMonthClass}`);
      if (currentMonthElement) {
        currentMonthElement.classList.remove(currentMonthClass);
      }
      if (this.monthDisplayElement.children[month]) {
        this.monthDisplayElement.children[month].classList.add(currentMonthClass);
      }
    }
  }

  highlightMonthsWithPosts() {
    const year = this.date.getFullYear();
    if (!this.monthDisplayElement) {
      return;
    }

    const monthItems = this.monthDisplayElement.getElementsByTagName('li');

    for (let i = 0, tot = monthItems.length; i < tot; i++) {
      const monthElement = monthItems[i];
      monthElement.classList.remove('month-has-posts');
      const monthIndex = monthElement.getAttribute('title');

      if (monthIndex !== null) {
        const yearMonthString = `${year}/${parseInt(monthIndex, 10) + 1}`;
        if (this.posts.some((post) => post.dateString.startsWith(yearMonthString))) {
          monthElement.classList.add('month-has-posts');
        }
      }
    }
  }

  buildRibbon() {
    if (this.ribbonElement && this.post) {
      this.ribbonElement.innerText = this.post.index;
    }
  }
}

function initializePage() {
  if (typeof activePost === 'undefined' || typeof posts === 'undefined') {
    console.error('Necessary data not found ("activePost" and "posts")');
    return;
  }

  new Calendar(posts, activePost);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
