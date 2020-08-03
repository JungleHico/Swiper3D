// 自定义3D轮播插件

/*
    options: {
        autoplay: {
            delay: 3000
            disableOnInteraction: true
        },
        pagination: {
            el: domElement
        }
    }
*/
function Swiper3D(ele, options) {
    var swiperWrapper = ele.querySelector(".swiper3D-wrapper");
    var swiperSlides = swiperWrapper.getElementsByClassName("swiper3D-slide");
    var length = swiperSlides.length;
    var stepAngle = 360 / length;	// degree per step
    var activeIndex = 0;
    var realIndex = 0;
    var perspective = 0;
    var rotateRadius = 0;

    var delay = 3000;	// 自动播放间隔时间
    var disableOnInteraction = true;	// 手动切换时是否取消自动轮播
    var timer = null;

    var pagination = {};
    var paginationObject = null;
    var paginationBullets = [];

    var navigation = {};
    var prevButton = null;
    var nextButton = null;

    var offset = 0;	 // touching offset
    var offsetDeg = 0;	// rotation degree of touching

    this.slideNext = next;
    this.slidePrev = prev;
    this.slideTo = switchTo;

    init();

    function init() {
        for (var i = 0; i < length; i++) {
            swiperSlides[i].style.transform = "translate(-50%, -50%) rotateY(" + stepAngle * i + "deg)";
        }
        initPerspective();
        setZIndex();
        initPagination();
        setPaginationIndex();
        initNavigation();
        setAutoplay();
        handleTouch();
    }

    // 初始化视距
    function initPerspective() {
        swiperWrapper.style.perspective = document.body.clientWidth + "px";
        for (var i = 0; i < length; i++) {
            swiperSlides[i].style.transformOrigin = "center center -" + document.body.clientWidth * 0.6 + "px";
        }
    }

    // 设置层次
    function setZIndex() {
        for (var i = 0; i < length; i++) {
            var diff = Math.abs(i - realIndex);
            diff = diff <= length / 2 ? diff : length - diff;
            swiperSlides[i].style.zIndex = length - diff;
        }
    }

    // 初始化分页器
    function initPagination() {
        if (options != undefined && options.pagination != undefined && typeof pagination == "object") {
            pagination = options.pagination;
        }
        if (pagination.el != undefined && typeof pagination.el == "string") {
            paginationObject = ele.querySelector(pagination.el);
            paginationObject.classList.add("swiper3D-pagination-bullets");
            for (var i = 0; i < length; i++) {
                var paginationBullet = document.createElement("span");
                paginationBullet.classList.add("swiper3D-pagination-bullet");
                paginationObject.appendChild(paginationBullet);
            }
            paginationBullets = paginationObject.getElementsByClassName("swiper3D-pagination-bullet");

            if (pagination.clickable) {
                paginationObject.classList.add("pagination-clickable");
                paginationObject.addEventListener("click", function(e) {
                    if (e.target.classList.contains("swiper3D-pagination-bullet"));
                    for (var i = 0; i < length; i++) {
                        if (paginationBullets[i] == e.target) {
                            switchTo(i);
                            break;
                        }
                    }
                }, false);
            }
        }
    }
    function setPaginationIndex() {
        if (paginationBullets[realIndex]) {
            for (var i = 0; i < length; i++) {
                paginationBullets[i].classList.remove("swiper3D-pagination-bullet-active");
            }
            paginationBullets[realIndex].classList.add("swiper3D-pagination-bullet-active");
        }
    }

    // 设置自动播放
    function setAutoplay() {
        if (options != undefined && options.autoplay != undefined) {
            if (options.autoplay.delay != undefined && typeof options.autoplay.delay == "number" && options.autoplay.delay >= 0) {
                delay = options.autoplay.delay;
            }
            if (timer == null) {
                timer = setInterval(function() {
                    next();
                }, delay);
            }
        }
        if (options != undefined && options.autoplay != undefined
            && options.autoplay.disableOnInteraction != undefined && typeof options.autoplay.disableOnInteraction == "boolean") {
            disableOnInteraction = options.autoplay.disableOnInteraction;
        }
    }
    // 取消自动播放
    function stopAutoplay() {
        if (timer != null) {
            clearInterval(timer);
            timer = null;
        }
    }

    // 初始化前进后退按钮
    function initNavigation() {
        if (options != undefined && options.navigation != undefined && typeof options.navigation == "object") {
            navigation = options.navigation;
        }
        if (navigation.prevEl != "undefined" && typeof navigation.prevEl == "string") {
            prevButton = ele.querySelector(navigation.prevEl);
            prevButton.addEventListener("click", function() {
                prev();
            }, false);
        }
        if (navigation.nextEl != "undefined" && typeof navigation.nextEl == "string") {
            nextButton = ele.querySelector(navigation.nextEl);
            nextButton.addEventListener("click", function() {
                next();
            }, false);
        }
    }

    // 滑动
    function handleTouch() {
        var touch = false;
        var startX = 0;
        var currentX = 0;
        var diffX = 0;
        
        swiperWrapper.addEventListener("mousedown", function(e) {
            e.preventDefault();
            touch = true;
            startX = e.clientX;
        }, false);

        swiperWrapper.addEventListener("mousemove", function(e) {
            e.preventDefault();
            if (touch) {
                console.log("move")
                offset = e.clientX - startX;
                offsetDeg = Math.asin(offset / (document.body.clientWidth * 0.6)) * 180 / Math.PI;
                switchTo(realIndex);
            }
        }, false);

        swiperWrapper.addEventListener("mouseup", function(e) {
            e.preventDefault();
            touch = false;
        }, false);

        swiperWrapper.addEventListener("mouseleave", function(e) {
            e.preventDefault();
            touch = false;
        }, false);
    }

    function next() {
        // 取消自动轮播
        if (disableOnInteraction) {
            stopAutoplay();
        }
        activeIndex++;
        realIndex = activeIndex % length;
        realIndex = realIndex >= 0 ? realIndex : length + realIndex;
        for (var i = 0; i < length; i++) {
            swiperSlides[i].style.transform = "translate(-50%, -50%) rotateY(" + stepAngle * (i - activeIndex) + "deg)";
        }
        setZIndex();
        setPaginationIndex();
        if (disableOnInteraction) {
            setAutoplay();
        }
    }

    function prev() {
        if (disableOnInteraction) {
            stopAutoplay();
        }
        activeIndex--;
        realIndex = activeIndex % length;
        realIndex = realIndex >=0 ? realIndex : length + realIndex;
        for (var i = 0; i < length; i++) {
            swiperSlides[i].style.transform = "translate(-50%, -50%) rotateY(" + stepAngle * (i - activeIndex) + "deg)";
        }
        setZIndex();
        setPaginationIndex();
        if (disableOnInteraction) {
            setAutoplay();
        }
    }

    // 切换到指定页
    function switchTo(index) {
        if (index == undefined || typeof index != "number" || index < 0 || index >= length) {
            return;
        }
        if (disableOnInteraction) {
            stopAutoplay();
        }
        var diff = index - realIndex;
        activeIndex += diff;
        realIndex = activeIndex % length;
        realIndex = realIndex >=0 ? realIndex : length + realIndex;
        for (var i = 0; i < length; i++) {
            swiperSlides[i].style.transform = "translate(-50%, -50%) rotateY(" + stepAngle * (i - activeIndex) + "deg)";
        }
        setZIndex();
        setPaginationIndex();
        if (disableOnInteraction) {
            setAutoplay();
        }
    }	
}