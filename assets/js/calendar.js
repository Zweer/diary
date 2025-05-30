/**
 * Created by soyaine on 2016/12/3.
 * Last update: 2019/08/08
 */

function attachEvents() {
  const calEle = document.getElementById("calendar");
  const paperA = document.getElementById("paperBefore");

  const eventHandlers = {
    openCal: function(){
      calEle.style.display = "block";
      paperA.style.backgroundColor = "#FFC7C7";
    },
    closeCal: function(){
      calEle.style.display = "none";
      paperA.style.backgroundColor = "#fff";
    },
  };

  const closeBtn = document.getElementById("closeBtn");
  const openBtn = document.getElementById("openBtn");

  closeBtn.addEventListener('click', eventHandlers.closeCal, false);
  openBtn.addEventListener('click', eventHandlers.openCal, false);
}

function initCalendar() {
    const cal = {
        today: new Date(),
        on: new Date(activeArticle),
        dateEle: document.getElementsByClassName("cal-day"),
        render : {},

        highlightMonthsWithPosts: function() {
            const year = this["on"].getFullYear();
            const monthEle = document.getElementById("calMonth");
            if (!monthEle) return;

            const monthItems = monthEle.getElementsByTagName("li");

            for (let k = 0; k < monthItems.length; k++) {
                monthItems[k].classList.remove('month-has-posts');
                const monthIndex = monthItems[k].getAttribute('title');
                if (monthIndex !== null) {
                    const currentMonthStr = year + '-' + String(parseInt(monthIndex, 10) + 1).padStart(2, '0');
                    if (typeof postMonths !== 'undefined' && postMonths.includes(currentMonthStr)) {
                        monthItems[k].classList.add('month-has-posts');
                    }
                }
            }
        },

        loadCal : function() {
            const render = this.render;
            const elem = this.dateEle;
            let i = 0;

            const y = this["on"].getFullYear();
            const m = this["on"].getMonth();

            const yearEle = document.getElementById("calYear");
            const monthEle = document.getElementById("calMonth");

            for (let day in render) {
                elem[i].setAttribute("id", day);
                const month = new Date(day).getMonth();

                if (render[day].url) {
                    elem[i].innerHTML = "<a href='" + render[day].url + "'>" + render[day].date + "</a>";
                } else {
                    elem[i].innerText = render[day].date;
                }

                if (day === this.today.toLocaleDateString()) {
                    elem[i].classList.add("now");
                }

                if (month !== m) {
                    elem[i].classList.add("outmonth");
                }

                i++;
            }

            yearEle.children[1].innerText = y;

            const mThis = monthEle.getElementsByClassName("cal-month__now");
            mThis[0].classList.remove("cal-month__now");

            monthEle.children[m].classList.add("cal-month__now");
        },

        //som: (function(){
        //    const first = new Date();
        //    first = this.data[first];
        //    return new Date(first.getYear(), first.getMonth(), -first.getDay());
        //}())

        loadLink: function() {
            // const url = this.url;
            const url = urlJSON;
            for (let n in url) {
                n = n.replace(/^[\s\uFEFF\xA0\n]+|[\s\uFEFF\n\xA0]+$/g, '');
                const ele = document.getElementById(n);
                if (ele) {
                    ele.innerHTML = "<a href='" + url[n].url + "'>" + this.render[n].date + "</a>";
                    ele.title = url[n].excerpt;
                    //render[n]["url"] = url[n];
                }
            }
        },

        loadDate: function(first) {
                // Get the date of the first Monday in the calendar of this month based on any date
                first.setDate(1);
                const y = first.getFullYear();
                const m = first.getMonth();
                const w = first.getDay();
                if(!w) w = 7; // For Sunday, the getDay() value is 0, converting 0 to 7
                first = new Date(y, m, 2-w); // Monday is the first day
                // first = new Date(y, m, 1-w); // Sunday is the first day

                // Loop through all dates
                const arr = {};
                for(let i = 0; i < 42; i++){
                    let date = first.getDate();
                    const dateStr = `${first.getFullYear()}/${first.getMonth()+1}/${first.getDate()}`;
                    arr[dateStr] = {
                        "date": date
                        //"url": null
                    };
                    first.setDate(++date);
                }
                return arr;
        },

        loadPageIndex: function() {
            if (activeArticle && urlJSON[activeArticle]) {
                const indexEle = document.getElementById("postIndex");
                indexEle.innerText = urlJSON[activeArticle]['index'];
            }
        },

        init: function() {
            this.render = this.loadDate(this["on"]);
            this.loadPageIndex();
            this.loadCal();
            this.loadLink();
        }
    };

    const removeActiveNow = function() {
        const onEles = document.getElementsByClassName("cal-day now");

        if (onEles.length) {
            onEles[0].classList.remove("now");
        }
    };

    const swtich = function(y, m) {
        removeActiveNow();
        cal.on.setFullYear(y);
        cal.on.setMonth(m);
        cal.init();
    };

    const monthNav = document.getElementById("calMonth");
    monthNav.addEventListener('click', function(event) {
        const month = event.target.title;
        swtich(cal.on.getFullYear(), +month);
    }, false);

    const lastYearBtn = document.getElementById("lastYearBtn");
    const nextYearBtn = document.getElementById("nextYearBtn");

    lastYearBtn.addEventListener('click', function() {
        swtich(cal.on.getFullYear() - 1, 11)
    }, false);
    nextYearBtn.addEventListener('click', function() {
        swtich(cal.on.getFullYear() + 1, 0)
    }, false);

    cal.init();
}



function initPage() {
    initCalendar();
    attachEvents();
}

initPage();
