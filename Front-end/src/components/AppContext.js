import {createContext, useEffect, useReducer, useState} from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AppContext = createContext();

export const ACTIONS = {
    ADD_TO_CART: "add-to-cart",
    REMOVE_FROM_CART: "remove-from-cart",
    CLEAR_CART: "clear-cart",
    LOAD_CART: "load-cart",
    SET_CART: "set-cart",
    UPDATE_CART: "update-cart",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_TO_CART:
            const itemInCart = state.find(item => item.article?.id === action.payload.id);
            if (itemInCart) {
                return state.map((item) => {
                    if (item.id === action.payload.id) {
                        return {...item, quantity: item.quantity + 1};
                    }
                    return item;
                });
            } else {
                return [...state, action.payload];
            }
        case ACTIONS.UPDATE_CART:
            return state.map((item) => {
                if (item.id === action.payload.id) {
                    return {...item, quantity: action.payload.quantity};
                }
                return item;
            });
        case ACTIONS.REMOVE_FROM_CART:
            let newState = state.map((item) => {
                if (item.id === action.payload.id) {
                    return {...item, quantity: item.quantity - 1};
                }
                return item;
            });
            return newState.filter(item => item.quantity > 0);
        case ACTIONS.LOAD_CART:
            if (Array.isArray(action.payload)) {
                return [...state, ...action.payload.filter(item => !state.some(stateItem => stateItem.id === item.id))];
            } else {
                console.error('action.payload should be an array:', action.payload);
                return state;
            }

        case ACTIONS.CLEAR_CART:
            return [];

        case ACTIONS.SET_CART:
            return [...action.payload];
        default:
            return state;
    }

}


export const AppProvider = ({children}) => {
    const [cart, dispatch] = useReducer(reducer, []);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loadingCartOperation, setLoadingCartOperation] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(cart.reduce((acc, item) => acc + item.quantity, 0));

    useEffect(() => {
        setTotalQuantity(cart.reduce((acc, item) => acc + item.quantity, 0));
    }, [cart]);

    useEffect(() => {
        if (!isLoggedIn && !firstLoad) {
            if (cart.length > 0) {
                localStorage.setItem('cart', JSON.stringify(cart));
            } else {
                localStorage.removeItem('cart');
            }
        }
        setFirstLoad(false);
    }, [cart, isLoggedIn, firstLoad]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');


        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                setIsLoggedIn(true);
                setIsAdmin(decodedToken.roles.includes("ROLE_ADMIN"));
                setUserId(decodedToken.userId);

            } catch (error) {
                console.log("Error decoding token:", error);
            }
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUserId(null);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            const headers = {Authorization: `Bearer ${token}`};

            axios.get("/cartitem", {headers})
                .then((response) => {
                    dispatch({type: ACTIONS.LOAD_CART, payload: response.data});
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        dispatch({type: ACTIONS.LOAD_CART, payload: []});
                    } else {
                        console.log("Error loading cart: ", error);
                    }
                });
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            dispatch({type: ACTIONS.LOAD_CART, payload: localCart});
        }
    }, [isLoggedIn]);


    const clearCart = () => {
        setLoadingCartOperation(true);
        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            const headers = {Authorization: `Bearer ${token}`};

            axios.post('/cart/clear', {}, {headers})
                .then((response) => {
                    dispatch({type: ACTIONS.CLEAR_CART});
                })
                .catch((error) => {
                    console.log("Erreur lors du vidage du panier :", error);
                })
                .finally(() => {
                    setLoadingCartOperation(false);
                });

        } else {
            dispatch({type: ACTIONS.CLEAR_CART});
            localStorage.removeItem('cart');
            setLoadingCartOperation(false);
        }
    };

    const removecart = () => {
        dispatch({type: ACTIONS.CLEAR_CART});
        localStorage.removeItem('cart');
    };

    const login = async (email, password) => {
        try {
            let response = await axios.post('/login', {email, password});
            let token = response.data.token;
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('jwtToken', token);
                const decodedToken = jwt_decode(token);
                setIsLoggedIn(true);
                setIsAdmin(decodedToken.roles.includes("ROLE_ADMIN"));
                setUserId(decodedToken.userId);
                console.log(setUserId());
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setUserId(null);
            }
        } catch (error) {
            console.log("Error logging in: ", error);
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUserId(null);
        }
    };

    const logout = async (callback, sessionExpired = false) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log("No token found, cannot log out");
            return;
        }
        const decodedToken = jwt_decode(token);
        const username = decodedToken.username;

        try {
            await axios.post('/logout', {username: username});
        } catch (error) {
            console.log("Error logging out: ", error);
        }

        removecart();

        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserId(null);
        if (sessionExpired) {
            localStorage.removeItem('jwtToken');
        }
        callback && callback();
    };


    const addToCart = (article, quantity = 1) => {
        setLoadingCartOperation(true);

        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            const headers = {Authorization: `Bearer ${token}`};

            axios.post(`/cartitem/add`, {id: article.id, quantity}, {headers})
                .then((response) => {
                    const itemInCart = cart.find(item => item.article?.id === article.id);
                    if (itemInCart) {
                        dispatch({
                            type: ACTIONS.UPDATE_CART,
                            payload: {id: itemInCart.id, quantity: itemInCart.quantity + quantity}
                        });
                    } else {
                        const newItem = {...article, quantity: quantity};
                        dispatch({
                            type: ACTIONS.ADD_TO_CART,
                            payload: newItem,
                        });
                    }
                    setLoadingCartOperation(false);
                })
                .catch((error) => {
                    console.log("Error adding to cart: ", error);
                    if (error.response) {
                        console.log("Error data: ", error.response.data);
                        console.log("Error status: ", error.response.status);
                    }
                    setLoadingCartOperation(false);
                });
        } else {
            const itemInCart = cart.find(item => (item.article?.id ?? item.id) === article.id);
            if (itemInCart) {
                dispatch({
                    type: ACTIONS.UPDATE_CART,
                    payload: {id: itemInCart.id, quantity: itemInCart.quantity + quantity}
                });
            } else {
                const newItem = {...article, quantity: quantity};
                dispatch({
                    type: ACTIONS.ADD_TO_CART,
                    payload: newItem,
                });
            }
            setLoadingCartOperation(false);
        }
    };

    const removeFromCart = (id, quantity = 1) => {
        setLoadingCartOperation(true);

        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            const headers = {Authorization: `Bearer ${token}`};

            axios.delete(`/cartitem/remove/${id}`, {headers})
                .then((response) => {
                    dispatch({type: ACTIONS.REMOVE_FROM_CART, payload: {id, quantity}});
                    setLoadingCartOperation(false);
                })
                .catch((error) => {
                    console.log("Error removing from cart: ", error);
                    setLoadingCartOperation(false);
                });
        } else {
            dispatch({type: ACTIONS.REMOVE_FROM_CART, payload: {id, quantity}});
            setLoadingCartOperation(false);
        }
    };


    // axios.interceptors.response.use(response => response, error => {
    //     if (error.response.status === 401) {
    //         logout(() => {
    //             window.location.href = "/login?sessionExpired=true";
    //         });
    //     }
    //     return Promise.reject(error);
    // });

    return (
        <AppContext.Provider
            value={{
                cart,
                dispatch,
                clearCart,
                addToCart,
                removeFromCart,
                isLoggedIn,
                setIsLoggedIn,
                isAdmin,
                setIsAdmin,
                userId,
                setUserId,
                login,
                logout,
                loadingCartOperation,
                totalQuantity,
            }}>
            {children}
        </AppContext.Provider>
    );
};
