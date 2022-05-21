import React from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../components/user/Register";
import Login from "../components/user/Login";
import Profile from "../components/user/Profile";
import QuizTitle from "../components/quiz/QuizTitle";
import QuizMake from "../components/quiz/QuizMake";
import QuizSearch from "../components/quiz/QuizSearch";
import QuizMyList from "../components/quiz/QuizMyList";
import QuizGameRoom from "../components/quiz/QuizGameRoom";
import PlaySelect from "../components/play/PlaySelect";
import PlayHost from "../components/play/host/PlayHost";
import PlayUser from "../components/play/user/PlayUser";
import PlayHostLoading from "../components/play/host/PlayHostLoading";
import PlayUserLoading from "../components/play/user/PlayUserLoading";
import Home from "../components/home/Home";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/quizMake" component={QuizMake} />
      <Route exact path="/quizSearch" component={QuizSearch} />
      <Route exact path="/quizTitle" component={QuizTitle} />
      <Route exact path="/quizMyList" component={QuizMyList} />
      <Route path="/room/:name" component={QuizGameRoom} />
      <Route exact path="/playSelect" component={PlaySelect} />
      <Route exact path="/playHost" component={PlayHost} />
      <Route exact path="/playUser" component={PlayUser} />
      <Route exact path="/playHostLoading" component={PlayHostLoading} />
      <Route exact path="/playUserLoading" component={PlayUserLoading} />
    </Switch>
  );
};

export default Routes;
