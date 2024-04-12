import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import FooterCom from "./components/FooterCom";
import About from "./pages/About";
import Contents from "./pages/Contents";
import CreatePost from "./pages/CreatePost";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import OnlyEditorPrivateRoute from "./components/OnlyEditorPrivateRoute";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTap from "./components/ScrollToTap";

function App() {
  return (
    <div className="App text-">
    <BrowserRouter>
      <ScrollToTap />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hakkimizda' element={<About />} />
        <Route path="/giris-yap" element={<SignIn />} />
        <Route path="/kayit-ol" element={<SignUp />} />
        <Route path='/icerikler' element={<Contents />} />
        <Route element={<PrivateRoute />} >
          <Route path='/kontrol-paneli' element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
        </Route>
        <Route element={<OnlyEditorPrivateRoute />} >
          <Route path='/gonderi-olustur' element={<CreatePost />} />
          <Route path='/gonderi-duzenle/:postId' element={<UpdatePost />} />
        </Route>

        <Route path="/post/:postSlug" element={<PostPage />} /> 
        <Route path="/post/:postSlug/comment/:commentId" element={<PostPage />} /> 
      </Routes>
      <FooterCom />
    </BrowserRouter>
    </div>
  );
}

export default App;
