'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');
//获取承载图片信息的json文件
var imageDatas = require('../data/imageData.json');
//利用自执行函数，将图片名信息拼接成图片地址
imageDatas = (function genImageURL(imageDatasArr){
	for(var i = 0, j = imageDatasArr.length; i < j; i++)
	{
		var singleImageData = imageDatasArr[i];
		singleImageData.imgURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);


//构建单张图片的react-components
var ImgFigure = React.createClass(
{
	render: function(){
		return (<figure className="img-figure">
			<img src={this.props.data.imgURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>);
			}
});
//产生两区间内的随机数
function getRangeRandom(min, max){
	return min + Math.floor(Math.random() * (max - min + 1));
}
var MyreactprojectApp = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			top: 0
		},
		hPosRange: {
			//水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {
			//垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},
	//重新布局所有的图片
	//@para centerIndex指定居中排布哪张图片
	rearrange: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeleftSecX = hPosRange.leftSecX,
		hPosRangerightSecX = hPosRange.rightSecX,
		hPosRangey = hPosRange.y,
		vPosRangex = vPosRange.x,
		vPosRangetopY = vPosRange.topY;
		//上方位置的图片信息
		var imgsArrangeTopArr = [],
		topImgNum = Math.floor(Math.random() * 2),
		topImgSpliceIndex = 0,
		//获取需要居中的图片的位置状态
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		imgsArrangeCenterArr[0].pos = centerPos;
		//获取需要布局到上侧的图片的状态信息
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		while(topImgSpliceIndex === centerIndex){
				topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		}
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		imgsArrangeTopArr.foreach(function(value, index){
			imgsArrangeTopArr[index].pos = {
				left: getRangeRandom(vPosRangex[0], vPosRangex[1]),
				top: getRangeRandom(vPosRangetopY[0], vPosRangetopY[1])
				};
		});
		//布局左右两侧的图片
		for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
			var PosLeftOrRight = null;
			if(i < k){
				PosLeftOrRight = hPosRangeleftSecX;
			}
			else{
				PosLeftOrRight = hPosRangerightSecX;
			}
			imgsArrangeArr[i].pos = {
				left: getRangeRandom(PosLeftOrRight[0], PosLeftOrRight[1]),
				top: getRangeRandom(hPosRangey[0], hPosRangey[1])
			};
		}
	},
	getInitialState: function(){
		return {
			imgsArrangeArr: []
		};
	},
	//组件加载以后，为每张图片计算位置范围
	componentDidMount: function(){
		//获取舞台的大小
		var stageDOM = React.findDOMNode(this.refs.stage),
		stageDOMWidth = stageDOM.scrollWidth,
		stageDOMHeight = stageDOM.scrollHeight,
		halfWidth = Math.ceil(stageDOMWidth / 2),
		halfHeight = Math.ceil(stageDOMHeight / 2);
		//获取图片的大小
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
		imgW = imgFigureDOM.scrollWidth,
		imgH = imgFigureDOM.scrollHeigth,
		halfImgW = Math.ceil(imgW / 2),
		halfImgH = Math.ceil(imgH / 2);
		//计算中心图片的位置
		this.Constant.centerPos = {
			left: halfWidth - halfImgW,
			top: halfHeight - halfHeight
		};
		//左、右区域的X、Y范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfWidth - 3 * halfImgW;
		this.Constant.hPosRange.rightSecX[0] = halfWidth + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageDOMWidth - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageDOMHeight - halfImgH;
		//上部区域的XY范围
		this.Constant.vPosRange.x[0] = halfWidth - imgW;
		this.Constant.vPosRange.x[1] = halfWidth;
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfHeight - 3 * halfImgH;
		//调用重新排布图片的函数
		this.rearrange(0);
	},
	render: function(){
		var controllerUnits = [];
		var imgFigures = [];
		imageDatas.forEach(function(value, index)
		{
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: '0',
						top: '0'
					}
				};
			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index}/>);
		}.bind(this));
		return (
		<section className="stage" ref="stage">
			<section className="img-sec">
				{imgFigures}
			</section>
			<nav className="controller-nav">
				{controllerUnits}
			</nav>
		</section>
	);
  }
});
React.render(<MyreactprojectApp />, document.getElementById('content')); // jshint ignore:line

module.exports = MyreactprojectApp;
