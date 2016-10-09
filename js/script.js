// var height = window.innerHeight;
// var width = window.innerWidth;
// var radius = (width * 0.4) / 2;
// var divHeight = height * 0.75;
// var margins = (divHeight - radius * 4) / 3;
// var topMargin = margins + height * 0.25;
// console.log(topMargin);
// // document.getElementById("like").style = 'top:' + topMargin + 'px';
// // document.getElementById("dislike").style = 'bottom:' + margins + 'px';
// console.log(margins);
$( document ).ready(function() {

function changeContent() {
    if ($("#two").is(':hidden'))
        showList();
    else
        vote();
}
$('.change-content').click(function (e) {
    //  e.preventDefault();
    changeContent();
});
document.getElementById("like").addEventListener('touchstart', function (e) {
    this.src = "images/mhw-b-plus-2.png";
}, false);
document.getElementById("like").addEventListener('touchend', function (e) {
    this.src = "images/mhw-b-plus-1.png"
}, false);
document.getElementById("dislike").addEventListener('touchstart', function (e) {
    this.src = "images/mhw-b-minus-2.png";
}, false);
document.getElementById("dislike").addEventListener('touchend', function (e) {
    this.src = "images/mhw-b-minus-1.png"
}, false);

var requrl = "https://pure-everglades-50833.herokuapp.com/api/v1/";

function getCurrentSpeaker() {
    $.ajax({
        method: "GET",
        url: requrl + "list"
    }).done(function (msg) {
        for (var i = 0; i < msg.data[0].list.length; i++) {
            if (msg.data[0].list[i].active) {
                var maxLength = 45;
                // window.navigator.vibrate(200);
                var prName = msg.data[0].list[i].project_name;
                if (prName.length >= maxLength) {
                    prName = prName.substring(0, maxLength) + "...";
                }
                document.getElementById("project").innerHTML = prName;
                var spName = msg.data[0].list[i].speaker_name;
                if (spName.length >= 20) {
                    spName = spName.substring(0, 20) + "...";
                }

                document.getElementById("project").innerHTML = prName.toUpperCase();
                document.getElementById("speaker").innerHTML = spName.toUpperCase();
                document.getElementById('currentLikesAmount').innerHTML = "+"+ msg.data[0].list[i].like;
                document.getElementById('currentDislikesAmount').innerHTML = "-"+msg.data[0].list[i].dislike;
                return;
            }
        }
        
        // window.navigator.vibrate(200);
        document.getElementById("project").innerHTML = "PLEASE WAIT:)";
    });
    setTimeout(getCurrentSpeaker, 1000);
}

getCurrentSpeaker();


function showList() {
    // window.navigator.vibrate(200);
    $('table').empty();
    $('#likes').hide();
    $("#presenters").show();
    $("#one").hide();
    $('#two').show();
    $("#showPresenters").hide();
    $("#currentSpeaker").hide();    
    $("#vote").show();
    var table = document.getElementById("presenters");
    $.ajax({
        method: "GET",
        url: requrl + "list"
    }).done(function (msg) {
            // var htmlka = '';
            for (var i = 0; i < msg.data[0].list.length; i++) {
                // var style ='';
                // if (msg.data[0].list[i].active) { style =  'style="background-color: rgba(0, 204, 0, 0.2);"' }
                // htmlka +='<tr ' + style+'>'+
                //     '<td class="cell" style="width: 70%;">'+
                //     '<b>'+msg.data[0].list[i].project_name+'</b>'+
                //     '<br>'+msg.data[0].list[i].speaker_name+'</td>'+
                //     '<td class="likeSymb"><span>+'+msg.data[0].list[i].dislike+'</span>'+
                //     '<br><span>-'+msg.data[0].list[i].dislike+'</span></td>'+
                //     '</tr>';
                var row = table.insertRow(i);
                var projectname = row.insertCell(0);
                var likes = row.insertCell(1);
                projectname.innerHTML = "<b>" + msg.data[0].list[i].project_name + "</b>" + "<br>" + msg.data[0].list[i].speaker_name;
                if(msg.data[0].list[i].like>0&&msg.data[0].list[i].dislike>0)
                    likes.innerHTML = "<span>+" + msg.data[0].list[i].like + "</span><br><span>-" + msg.data[0].list[i].dislike + "</span>";
                projectname.className = 'cell';
                likes.className = 'likeSymb';
                projectname.style = "width: 70%";
                if (msg.data[0].list[i].active) {
                    row.style = "background-color: rgba(0, 204, 0, 0.2)"
                }
            }
            // table.html(htmlka)
        });
}

function vote() {
    $("#one").show();
    $("#two").hide();
    $("#showPresenters").show();
    $("#presenters").hide();
    $('#likes').show();
    $("#currentSpeaker").show();
    $('#vote').hide();
    window.navigator.vibrate(100);
    getCurrentSpeaker();
}

function like() {
    window.navigator.vibrate(100);
    $.ajax({
        method: "POST",
        url: "https://pure-everglades-50833.herokuapp.com/api/v1/plus"
    })
    .done(function (msg) {

    });
}

function dislike() {
    window.navigator.vibrate(200);
    $.ajax({
        method: "POST",
        url: "https://pure-everglades-50833.herokuapp.com/api/v1/minus"
    }).done(function (msg) {

    });
}

$('#like').click(function () {
    like();
});

$('#dislike').click(function () {
    dislike();
});


//prevent landscape
$(window).bind('orientationchange resize', function(event){
    if (event.orientation) {
        if (event.orientation == 'landscape') {
            if (window.rotation == 90) {
                rotate(this, -90);
            } else {
                rotate(this, 90);
            }
        }
    }
});

function rotate(el, degs) {
    iedegs = degs/90;
    if (iedegs < 0) iedegs += 4;
    transform = 'rotate('+degs+'deg)';
    iefilter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+iedegs+')';
    styles = {
        transform: transform,
        '-webkit-transform': transform,
        '-moz-transform': transform,
        '-o-transform': transform,
        filter: iefilter,
        '-ms-filter': iefilter
    };
    $(el).css(styles);
}
});
