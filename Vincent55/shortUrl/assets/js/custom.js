$("#urlForm").submit(function () {
    return false;
});

function fetch_from_server() {
    $("input").each(function () {
        if ($(this).val() != null && validURL($(this).val())) {
            $(".preloader").fadeIn(200);
            $.ajax({
                url: '/web',// 跳轉到  web
                data: {
                    url: $("#url").val()
                },
                type: 'POST',
                cache: false,
                success: function (data) {
                    show_data(data);

                },
                error: function () {
                    // view("異常！"); 
                    alert("異常！");
                    $(".preloader").fadeOut(100);
                }
            });
        } else {
            show_error_input(
                $(this).parent(".form-group"),
                "這格只能填網址ㄛ🥺",
                $(this).attr("placeholder")
            );
        }
    });
}

function show_data(data) {
    $("#urlModalInner").html(data);
    $(".preloader").fadeOut(100);
    $("#urlModal").modal('show');
}

function refresh_main_page() {
    location.reload();
}

$(document).ready(function () {
    $('#urlTable tbody tr').each(function () {
        var full_url = $(this).children("td:nth-child(1)").children("a").text().replace(/\s/g, '');;
        var hide_url = full_url;
        if (full_url.length > 39) {
            hide_url = full_url.substr(0, 37) + "...";
        }
        $(this).children("td:nth-child(1)").children("a").text(hide_url);
    });
    $(".preloader").fadeOut(100);
});


$("#urlButton").click(function () {
    if (copyToClipboard($("#urlButton").attr("urlAttr"))) {
        $("#urlButton").text("複製成功！");
        $("#urlButton").removeClass("btn-secondary")
            .addClass("btn-success");
    } else {
        $("#urlButton").text("複製失敗 :(");
        $("#urlButton").removeClass("btn-secondary")
            .addClass("btn-danger");
        console.error("Async: Could not copy text: ", err);
    }
});

function copyToClipboard(copy_text) {
    var textarea = document.createElement("textarea");
    textarea.textContent = copy_text;
    document.body.appendChild(textarea);

    var selection = document.getSelection();
    var range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    var success = document.execCommand("copy");
    selection.removeAllRanges();
    document.body.removeChild(textarea);
    return success;
}

function show_error_input($selector, error_message, original_message) {
    $selector.addClass("has-danger");
    $selector
        .children("input, textarea")
        .val("")
        .blur()
        .attr("placeholder", error_message).addClass("red_input_placeholder");
    $selector.children("input, textarea").focus(function () {
        $selector.removeClass("has-danger");
        $selector.children("input,textarea").attr("placeholder", original_message);
    });
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}