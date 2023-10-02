import NavigationBar from "./components/Navbar";
import ArticleList from "./components/ArticleList";
import ArticleDetail from "./components/ArticleDetail";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateArticle from "./components/CreateArticle";
import AdminArticleEdit from "./components/AdminArticleEdit";
import AdminArticleList from "./components/AdminArticleList";
import Cart from "./components/Cart";
import AdminCategoryList from "./components/AdminCategoryList";
import CategoryPage from "./components/CategoryPage";
import AdminSubcategoryList from "./components/AdminSubcategoryList";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Footer from "./components/Footer";
import SubCategoryArticles from "./components/SubCategoryArticles";
import Checkout from "./components/Checkout";
import CategorySubcategories from "./components/CategorySubcategories";
import Profile from "./components/Profil";
import Orders from './components/Orders';
import Promotions from "./components/Promotions";
import {AppProvider} from "./components/AppContext";
import AdminLivraisonList from "./components/AdminLivraisonList";
import Nouveaute from "./components/Nouveaute";
import Contact from "./components/Contact";
import CGV from "./components/CGV";
import About from "./components/About";

function App() {
    return (
        <div className="bg-gray-100 d-flex flex-column min-vh-100">
            <Router>
                <AppProvider>
                    <NavigationBar/>
                    <div className="flex-grow-1">
                        <Routes key="routes">
                            <Route path="/" element={<ArticleList/>}/>
                            <Route path="/article/:id" element={<ArticleDetail/>}/>
                            <Route path="/promotions" element={<Promotions/>}/>
                            <Route path="/nouveaute" element={<Nouveaute/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/contact" element={<Contact/>}/>
                            <Route path="/cgv" element={<CGV/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/cart" element={<Cart/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/orders" element={<Orders/>}/>
                            <Route path="/checkout" element={<Checkout/>}/>
                            <Route path="/category" element={<CategoryPage/>}/>
                            <Route path="/category/:categoryId/subcategories"
                                   element={<CategorySubcategories/>}/>
                            <Route path="/subcategory/:subCategoryId/articles"
                                   element={<SubCategoryArticles/>}/>

                            <Route
                                path="/admin/create-article"
                                element={<CreateArticle/>}
                            />
                            <Route path="/admin/article" element={<AdminArticleList/>}/>
                            <Route
                                path="/admin/article/:id"
                                element={<AdminArticleEdit/>}
                            />
                            <Route path="/admin/category" element={<AdminCategoryList/>}/>
                            <Route
                                path="/admin/subcategory"
                                element={<AdminSubcategoryList/>}
                            />
                            <Route path="/admin/shipping" element={<AdminLivraisonList/>}/>
                        </Routes>
                    </div>
                    <Footer key="footer"/>
                </AppProvider>
            </Router>
        </div>
    );
}

export default App;
