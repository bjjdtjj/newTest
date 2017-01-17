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
	handleClick: function(e){
		e.stopPropagation();
		e.preventDefault();
		if(this.props.position.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
	},
	render: function(){
		var styleobj = {};
		if(this.props.position.pos){
			//styleobj = this.props.position.pos;
			//styleobj = {'left': this.props.position.pos.left, 'top': this.props.position.pos.top, 'transform': 'rotate(' + this.props.position.rotate + ')'};
			styleobj = this.props.position.pos;
		}
		if(this.props.position.rotate){
			['Webkit', 'ms', 'Moz', ''].forEach(function(value){
				styleobj[value + 'transform'] = 'rotate(' + this.props.position.rotate + ')';
			}.bind(this));
		}
		if(this.props.position.isCenter){
			styleobj.zIndex = 1000;
		}
		var imgFigureClassName = 'img-figure';
		imgFigureClassName += (this.props.position.isInverse ? ' is_inverse' : '');
		return (
		<figure className={imgFigureClassName} style={styleobj}>
		<div className="imgfront" onClick={this.handleClick}>
			<img src={this.props.data.imgURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
				</div><div className="imgBack" onClick={this.handleClick}>{this.props.data.desc}</div>
				</figure>);
}
});
//产生两区间内的随机数
function getRangeRandom(min, max){
	return min + Math.floor(Math.random() * (max - min + 1));
}
//产生-30度到正30度之间的一个随机角度
function get30degRandom(){
	return (Math.random() > 0.5) ? Math.ceil(Math.random() * 30) + 'deg' : '-' + Math.ceil(Math.random() * 30) + 'deg';
}
//var test = get30degRandom();
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
	/*
	翻转图片
	@param index:为需要执行翻转操作的图片位于图片信息数组中的index值
	@return {Function} return一个正在需要被执行的函数
	*/
	inverse: function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	},
	//使用闭包封装rearrange函数
	/*利用rearrange,居中对应index的图片
	@param index,return Function
	*/
	center: function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},
	//重新布局所有的图片
	//@para centerIndex指定居中排布哪张图片
	rearrange: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,
		//第一级
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		//第二级
		hPosRangeleftSecX = hPosRange.leftSecX,
		hPosRangerightSecX = hPosRange.rightSecX,
		hPosRangey = hPosRange.y,
		//上方取值范围
		vPosRangex = vPosRange.x,
		vPosRangetopY = vPosRange.topY;
		//上方位置的图片信息
		var imgsArrangeTopArr = [],
		topImgNum = Math.floor(Math.random() * 2),
		//topImgNum = 1,
		topImgSpliceIndex = 0,
		//获取需要居中的图片的位置状态
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		imgsArrangeCenterArr = {
			pos: centerPos,
			isInverse: false,
			isCenter: true
		};
		//获取需要布局到上侧的图片的状态信息
		if(topImgNum > 0 ){
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		while(topImgNum === centerIndex){
			topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		}
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		/*imgsArrangeTopArr.forEach(function(value, index){
			imgsArrangeTopArr[index].pos = {
				left: getRangeRandom(vPosRangex[0], vPosRangex[1]),
				top: getRangeRandom(vPosRangetopY[0], vPosRangetopY[1])
				};
		});*/
		imgsArrangeTopArr = {
			pos: {
				left: getRangeRandom(vPosRangex[0], vPosRangex[1]),
				top: getRangeRandom(vPosRangetopY[0], vPosRangetopY[1])
			},
			rotate: get30degRandom(),
			isInverse: false,
			isCenter: false
		};
		}
		//布局左右两侧的图片
		for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
			var PosLeftOrRight = null;
			if(i < k){
				PosLeftOrRight = hPosRangeleftSecX;
			}
			else{
				PosLeftOrRight = hPosRangerightSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					left: getRangeRandom(PosLeftOrRight[0], PosLeftOrRight[1]),
					top: getRangeRandom(hPosRangey[0], hPosRangey[1])
				},
				rotate: get30degRandom(),
				isInverse: false
			};
		}
		/*JS Function splice
			ArrayObj.splice(需要插入数组的位置，删除几项，新增数组项目)
		*/
		//将Top图片插入回imgsArrangeArr
		/*if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr);
		}*/
		imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr);
		//将Center图片插入回imgsArrangeArr
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr);
		//修改state状态值
		//test = imgsArrangeArr[0].pos;
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	},
	getInitialState: function(){
		return {
			imgsArrangeArr: []
			/*
				imgsArrangeArr:{
					{
						pos:{
							left:0,
							top:0
						},
						rotate:0,
						isInverse:false  图片正反面
						isCenter:false
					}
				}
			*/
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
		imgH = imgFigureDOM.scrollHeight,
		halfImgW = Math.ceil(imgW / 2),
		halfImgH = Math.ceil(imgH / 2);
		//计算中心图片的位置
		this.Constant.centerPos = {
			left: halfWidth - halfImgW,
			top: halfHeight - halfImgH
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
		//图片散列组
		//控制按钮组
		imageDatas.forEach(function(value, index)
		{
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} position={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			controllerUnits.push
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
