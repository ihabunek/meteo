'use strict';

var aladinBase = "http://prognoza.hr/aladinHR/";

// Oborine:
// http://prognoza.hr/aladinHR/web_3h_ob_uk_03_e.gif

var regions = {
    'DUBR': 'Dubrovnik',
    'HRv8': 'Hrvatska',
    'JEDR': 'Palagruža',
    'MASL': 'Zadar',
    'SENJ': 'Senj',
    'SPLI': 'Split'
};

function imageUrl(region, time) {
    return aladinBase + "web_uv10_" + region + "_" + (time < 10 ? '0' + time : time) + "_e.gif";
};

function imageUrls(region) {
    var counter = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    return Array(24).fill(0).map(function (x) {
        return 3 * counter++;
    }).map(function (x) {
        return imageUrl(region, x);
    });
};

function setRegion(region) {
    var urls = imageUrls(region);
    var $target = $("#images");

    $(".menu li").removeClass("active");
    $(".menu li a[data-region=" + region + "]").parent().addClass("active");

    $("#slider").data("region", region);
    $("#slider").val(0);
    $("#slider").show();

    $target.empty();
    urls.forEach(function (url, index) {
        return $target.append($('<img>').attr('src', url).attr('data-index', index).attr('style', 'display: none'));
    });

    showChart(0);

    $("#slider").focus();
};

function showChart(index) {
    $("#images img").hide();
    $("#images img[data-index=" + index + "]").show();
};

function init() {
    $(".menu a").click(function (event) {
        setRegion(event.target.dataset.region);
    });

    $("#slider").change(function (event) {
        var region = event.target.dataset.region;
        var index = parseInt(event.target.value);
        var time = 3 * (index + 1);

        $("#label").html(time + "h");

        showChart(index);
    });

    $("#play").click(function () {
        return playPause();
    });

    setRegion('HRv8');
};

var timer = void 0;

function tick() {
    var $slider = $("#slider");
    var value = parseInt($slider.val());
    var max = $slider.prop('max');

    if (value >= max) {
        $slider.val(0);
    } else {
        $slider.val(value + 1);
    }

    $slider.trigger("change");
};

function playPause() {
    return timer ? stop() : play();
};

function play() {
    timer = setInterval(tick, 750);
    $("#play").html("&#9209;");
};

function stop() {
    clearInterval(timer);
    timer = null;
    $("#play").html("&#9654;");
};