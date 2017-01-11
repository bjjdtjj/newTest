'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');
//获取承载图片信息的json文件
//var imageDatas = require('../data/imageData.json');
//利用自执行函数，将图片名信息拼接成图片地址
/*imageDatas = (function genImageURL(imageDatasArr){
	for(var i = 0, j = imageDatasArr.length; i < j; i++)
	{
		var singleImageData = imageDatasArr[i];
		singleImageData.imgURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);*/





var MyreactprojectApp = React.createClass({
  render: function() {
	return (
		<section className="stage">
			<section className="img-sec"></section>
			<nav className="controller-nav"></nav>
		</section>
	);
  }
});
React.render(<MyreactprojectApp />, document.getElementById('content')); // jshint ignore:line

module.exports = MyreactprojectApp;
