import { Route } from "react-router-dom";
import { TabBar } from "antd-mobile";
import styles from "./index.module.scss";
import Icon from "@/components/Icon";
import { useHistory, useLocation } from 'react-router-dom';
// 导入页面组件
import Home from "../Home";
import Question from "../Question";
import Profile from "../Profile";
import Video from "../Video";

const tabs = [
  { path: "/home/index", icon: "iconbtn_home", text: "首页" },
  { path: "/home/question", icon: "iconbtn_qa", text: "问答" },
  { path: "/home/video", icon: "iconbtn_video", text: "视频" },
  { path: "/home/profile", icon: "iconbtn_mine", text: "我的" },
];

const Layout = () => {
    const history = useHistory()
    const location = useLocation()

    const changeRoute = (path:string) => {
        history.push(path)
    }

  return(
  <div className={styles.root}>
    <Route exact path="/home/index">
        <Home></Home>
    </Route>
    <Route path="/home/question">
        <Question></Question>
    </Route>
    <Route path= "/home/video">
        <Video></Video>
    </Route>
    <Route path="/home/profile">
        <Profile></Profile>
    </Route>
  <TabBar 
  className="tab-bar"
  activeKey={location.pathname}
  onChange = {(key) => changeRoute(key)}
  >
    {tabs.map((item) =>(
        <TabBar.Item
            key={item.path}
            icon = {(active)=>(
                <Icon
                type={active ? `${item.icon}_sel`:item.icon}
                />
            )}
            title = {item.text}
        ></TabBar.Item>
    ))
    }
  </TabBar>
  </div>);
};

export default Layout;
