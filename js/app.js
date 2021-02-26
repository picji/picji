$(document).ready(function(){
	NProgress.start();
});

// 懒加载
function lazyload() {
	var images = document.getElementsByTagName('img');
	var len = images.length;
	var n = 0; //存储图片加载到的位置，避免每次都从第一张图片开始遍历	
	return function() {
		var seeHeight = document.documentElement.clientHeight;
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		setTimeout(function() {
			for (var i = n; i < len; i++) {
				if (images[i].offsetTop < seeHeight + scrollTop) {
					if (images[i].getAttribute('src') === './img/loading.gif') {
						NProgress.start();
						images[i].src = images[i].getAttribute('data-src');
					}
					n = n + 1;
				}
			}
			NProgress.done();
		}, 600)
	}
}
var loadImages = lazyload();
loadImages();
window.addEventListener('scroll', loadImages, false);

//总数和更新时间
window.onload = function() {
	$.getJSON("js/tree.json", function(result) {
		$("#total").text(result.data.length);
	});

	function formatTime(time, format) {
		var date = new Date(time);
		var formatter = function(i) {
			return (i < 10 ? '0' : '') + i
		};
		return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
			switch (a) {
				case 'yyyy':
					return formatter(date.getFullYear());
					break;
				case 'MM':
					return formatter(date.getMonth() + 1);
					break;
				case 'mm':
					return formatter(date.getMinutes());
					break;
				case 'dd':
					return formatter(date.getDate());
					break;
				case 'HH':
					return formatter(date.getHours());
					break;
				case 'ss':
					return formatter(date.getSeconds());
					break;
			}
		})
	}
	$.getJSON("https://api.github.com/repos/picji/bbq2", function(result) {
		var changeDate = result.updated_at;
		var date = formatTime(changeDate, 'yyyy-MM-dd HH:mm:ss');
		$("#update_time").text(date + ' CST');
	});
}


$(function() {

	$.getJSON("js/tree.json", function(result) {
		var each_count = 0;
		var cdn = "https://cdn.jsdelivr.net/gh/picji/bbq2@master/";
		$.each(result.data.reverse(), function(i, project) {
			if(project.id <= 245)
				cdn = "https://cdn.jsdelivr.net/gh/picji/bbq@master/";
			$("div.projects").append(
				'<div class="project" data-id="' + project.id + '"><a href="' + cdn +
				project.path +
				'" class="imgHolder" target="_blank" rel="noopener noreferrer"><img src="./img/loading.gif" data-src="' +
				cdn +
				project.path +
				'" title="' + project.name + '" alt="' + project.id + '-' + project.name + '"><i>' + project.id +
				'</i></a><p>' + project.name + '_' + project.tag + '</p></div>');
			each_count++;
		});
		if (each_count >= result.data.length) {
			var loadImages = lazyload();
			loadImages();
			window.addEventListener('scroll', loadImages, false);
		}
	});

	$("#keyword").bind("input propertychange", function(event) {
		doSearch();
	});
	//重置
	$('#reset').on('click', function() {
		$('.project').show();
		$('.projects').removeClass("jstc-c");
		$("#result_count").text('');
	});
	//监听 checkbox
	$("#fuzzy").click(function(){
		if($("input[type='checkbox'][id='fuzzy']").is(':checked')){
			$("label[for='fuzzy']").addClass("checked");
		} else {
			$("label[for='fuzzy']").removeClass("checked");
		}
		doSearch();
    });
})

function hotSearch(obj){
	document.getElementById('keyword').value=obj.innerHTML;
	NProgress.start();
	$(function(){
		//过滤首尾和一个以上空格
		var keyword = $('#keyword').val().replace(/[_]+/g," ").trim().replace(/[ ]+/g," ");
		if(keyword != null && keyword != undefined && keyword != ""){
			$('.projects').addClass("jstc-c");
		}
		$('.project').hide()
			.filter(":contains('"+ keyword +"')")
			.show();
		//结果统计
		var result_count = $(".projects").find("div[style='display: block;']").length;
		$("#result_count").text('搜索到 ' + result_count + ' 张');
		var loadImages = lazyload();
		loadImages();
	})
	NProgress.done();
}

// 通用搜索方法
function doSearch(){
	//搜索不区分大小写
	$.expr[":"].contains = $.expr.createPseudo(function(arg) {
		return function(elem) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});
	//过滤下划线、首尾和一个以上空格
	var keys = $('#keyword').val().replace(/[_]+/g," ").trim().replace(/[ ]+/g," ");
	var keyArr = keys.split(" ");
	if(keys == null || keys == undefined || keys == ""){
		$('.projects').removeClass("jstc-c"); // 搜索框为空
	} else {
		$('.projects').addClass("jstc-c");
		NProgress.start();
	}
	var keyword = "";
	//合并关键词
	$(keyArr).each(function(index,value){
		keyArr[index] = "\:contains('" + (value) + "')"; 
	});
	if($("input[type='checkbox'][id='fuzzy']").is(':checked')){
		//模糊搜索
		keyword = keyArr.join(','); //使用逗号并集选择
	} else {
		keyword = keyArr.join(''); //交集选择直接相连
	}
	
	//显示结果
	$('.project').hide().each(function(index,value){
		$(this)
		.filter(keyword)
		.show();
	});
	//结果统计
	if(keys == null || keys == undefined || keys == ""){
		$("#result_count").text('');
	} else {
		var result_count = $(".projects").find("div[style='display: block;']").length;
		$("#result_count").text('搜索到 ' + result_count + ' 张');
	}
	
	var loadImages = lazyload();
	loadImages();
	NProgress.done();
}

(function(){

    jQuery(document).ready(function() {
        /* ---------------------------------------------- /*
         * Scroll top
         /* ---------------------------------------------- */
	
		jQuery(window).scroll(function() {
            if (jQuery(this).scrollTop() > 100) {
                jQuery('.scroll-up').fadeIn();
            } else {
                jQuery('.scroll-up').fadeOut();
            }
        });
		
		jQuery('.scroll-up').click(function () {
			jQuery("html, body").animate({
				scrollTop: 0
			}, 700);
			return false;
		});
    });
})(jQuery);