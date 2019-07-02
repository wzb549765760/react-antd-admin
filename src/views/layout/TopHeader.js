import React, { Component } from 'react';
import { Icon, Avatar, Dropdown, Menu, Badge } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setUserInfo } from '@/redux/actions/userInfo';
import { emptyTag, addTag } from '@/redux/actions/tagList';
import { setBreadCrumb, setTags } from '@/redux/actions/setting';
import { routes } from '@/router/mainRouter';
import FullScreen from '@/components/FullScreen';
import Tags from './Tags';
import BasicDrawer from '@/components/BasicDrawer';

class TopHeader extends Component {
	state = { visible: false };
	handleLogout = () => {
		this.props.setUserInfo({});
		this.props.emptyTag();
		sessionStorage.removeItem('isLogin');
		this.props.history.push('/');
	};
	componentDidMount() {
		let userInfo = sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo'));
		if (userInfo) {
			this.props.setUserInfo(userInfo);
		} else {
			this.props.setUserInfo({});
			this.props.history.push('/login');
		}
	}
	toNews() {
		this.handClickTag('/news');
		this.props.history.push('/news');
	}
	handClickTag(path, parent) {
		for (let i = 0; i < routes.length; i++) {
			if (path === routes[i].path) {
				let obj = { path, title: '消息', component: routes[i].component };
				this.props.addTag(parent ? Object.assign({}, obj, { parent: parent.title }) : obj);
			}
		}
	}
	setting = () => {
		this.setState({ visible: true });
	};
	onClose = () => {
		this.setState({ visible: false });
	};
	onChangeTags = checked => {
		this.props.setTags({ show: checked });
		sessionStorage.setItem('tags', JSON.stringify({ show: checked }));
	};
	onChangeBreadCrumb = checked => {
		this.props.setBreadCrumb({ show: checked });
		sessionStorage.setItem('breadCrumb', JSON.stringify({ show: checked }));
	};
	render() {
		const DropdownList = (
			<Menu>
				<Menu.Item key="user">
					<Icon type="user" />
					{this.props.userInfo.userName}
				</Menu.Item>
				<Menu.Item key="setting" onClick={this.setting}>
					<Icon type="setting" />
					系统设置
				</Menu.Item>
				<Menu.Item key="logout" onClick={this.handleLogout}>
					<Icon type="logout" />
					退出登录
				</Menu.Item>
			</Menu>
		);
		const { tags } = this.props;
		return (
			<div className="top-header">
				<div className="top-header-inner">
					<div className="header-title">XX后台管理系统</div>
					<div className="header-right">
						<div className="full-screen">
							<FullScreen />
						</div>
						<div className="news-wrap">
							<Badge count={2}>
								<Icon style={{ fontSize: '21px', cursor: 'pointer' }} type="bell" onClick={this.toNews.bind(this)} />
							</Badge>
						</div>
						<div className="username">{Object.keys(this.props.userInfo).length > 0 && this.props.userInfo.role.name}</div>
						<div className="dropdown-wrap" id="dropdown-wrap">
							<Dropdown getPopupContainer={() => document.getElementById('dropdown-wrap')} overlay={DropdownList}>
								<div>
									<Avatar size="large" />
									<Icon style={{ color: 'rgba(0,0,0,.3)', cursor: 'pointer' }} type="caret-down" />
								</div>
							</Dropdown>
						</div>
					</div>
				</div>
				{tags.show ? <Tags /> : null}
				<BasicDrawer title="系统设置" closable onClose={this.onClose} visible={this.state.visible} onChangeTags={this.onChangeTags} onChangeBreadCrumb={this.onChangeBreadCrumb} breadCrumbChecked={this.props.breadCrumb.show} tagsChecked={this.props.tags.show}/>
			</div>
		);
	}
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
	setUserInfo: data => {
		dispatch(setUserInfo(data));
	},
	emptyTag: () => {
		dispatch(emptyTag());
	},
	addTag: data => {
		dispatch(addTag(data));
	},
	setBreadCrumb: data => {
		dispatch(setBreadCrumb(data));
	},
	setTags: data => {
		dispatch(setTags(data));
	}
});
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(TopHeader));
