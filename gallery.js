/*global $, window */
$(document).ready(function () {
    "use strict";

    var track = $("#gallery .gallery__track");
    var total = track.children().length;
    var prevBtn = $("#prev");
    var nextBtn = $("#next");
    var pager = $("#pager");
    var status = $("#status");
    var mobileQuery = window.matchMedia("(max-width: 600px)");
    var perPage = 0;
    var pages = 0;
    var page = 0;

    function firstIndex() {
        return Math.min(page * perPage, total - perPage);
    }

    function render() {
        var index = firstIndex();
        track.css("transform", "translateX(" + (-index * 100 / perPage) + "%)");
        pager.find(".pager__dot").removeClass("is-active").removeAttr("aria-current");
        pager.find(".pager__dot").eq(page).addClass("is-active").attr("aria-current", "true");
        prevBtn.prop("disabled", page === 0);
        nextBtn.prop("disabled", page === pages - 1);
        status.text("Страница " + (page + 1) + " из " + pages);
    }

    function goTo(newPage) {
        page = Math.max(0, Math.min(newPage, pages - 1));
        render();
    }

    function buildPager() {
        var i;
        pager.empty();
        for (i = 0; i < pages; i += 1) {
            pager.append(
                $("<li>").append(
                    $("<button>", {
                        "type": "button",
                        "class": "pager__dot",
                        "aria-label": "Страница " + (i + 1)
                    }).data("page", i)
                )
            );
        }
    }

    function update() {
        var newPerPage = mobileQuery.matches ? 1 : 3;
        var keep = perPage > 0 ? firstIndex() : 0;
        if (newPerPage === perPage) {
            return;
        }
        perPage = newPerPage;
        pages = Math.ceil(total / perPage);
        page = Math.min(Math.floor(keep / perPage), pages - 1);
        buildPager();
        render();
    }

    prevBtn.on("click", function () {
        goTo(page - 1);
    });

    nextBtn.on("click", function () {
        goTo(page + 1);
    });

    pager.on("click", ".pager__dot", function () {
        goTo($(this).data("page"));
    });

    $(window).on("resize", update);
    update();
});
