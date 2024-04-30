var header = document.querySelector('.header');
var lastScrollTop = 0;
var isHeaderVisible = true;
var scrollTimeout;

function handleScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 200) {
        hideHeader();
    } else if (scrollTop < lastScrollTop - 50 || scrollTop === 0) {
        showHeader();
    }

    lastScrollTop = scrollTop;
}

function hideHeader() {
    if (isHeaderVisible) {
        isHeaderVisible = false;
        clearTimeout(scrollTimeout);
        header.style.transform = "translateY(-100%)";
    }
}

function showHeader() {
    if (!isHeaderVisible) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isHeaderVisible = true;
            header.style.transform = "translateY(0)";
        }, 100);
    }
}

window.addEventListener("scroll", handleScroll);