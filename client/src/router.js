import React from 'react';
import { Router, Route, IndexRoute } from 'react-router'
import GS from './CommonStore/GSModel'
import Login from './Login/ui/Login'
import Register from './Register/ui/Register'
import Main from './Main/ui/Main.js';
import CommonModal from './CommonModal/ui/CommonModal';
import Folder from './Folder/ui/EditFolder';
import EditTag from './Tag/ui/EditTag';
import ShareContent from './FlowContent/ui/SharedContent';
function RouterConfig({ history }) {
  window.myHistory = history;
  let prex = "";
  let resizeTimeOut;
  function getBgImg() {
    var num = Math.floor(Math.random() * 10);
    var bgName = "./images/" + num + ".jpg";

  }
  window.onload = function () {
    //getBgImg();
    GS.init();
    window.isOnLoad = true;

  }
  let bgArrs = [1, 2, 3, 4, 5]
  let index = Math.floor((Math.random() * bgArrs.length));
  let num = bgArrs[index];
  return (
    <Router history={history}>
      <div>
        <Route path={GS.baseInfoSetting.routerPathPrex + "/index.html"} component={Main} />
        <Route path={GS.baseInfoSetting.routerPathPrex + "/login.html"} component={Login} />
        <Route path={GS.baseInfoSetting.routerPathPrex + "/register.html"} component={Register} />
        <Route path={GS.baseInfoSetting.routerPathPrex + "/share.html"} component={ShareContent} />
        <CommonModal></CommonModal>
        <Folder></Folder>
        <EditTag></EditTag>
        <div style={{
          left: 0,
          top: 0,
          overflow: "hidden",
          margin: 0,
          padding: 0,
          height: window.innerHeight,
          width: window.innerWidth,
          zIndex: -999,
          position: "fixed"
        }}>
          <img src={"./images/bg3.jpg"} style={{ position: "absolute", border: "none" }} />
        </div>
      </div>
    </Router>
  );
}

export default RouterConfig;
