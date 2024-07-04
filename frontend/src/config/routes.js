const routes = {
    home: '/',
    login: '/login',
    signup: '/signup',
    resetPassword: '/passwordReset',
    listBooks: '/books',
    bookDetail: '/bookDetail/:id',
    handmadeItem: '/handmadeItems',
    policy: '/policy',
    borrowerCard: '/borrowerCard',
    cart: '/cart',
    borrowerSlips: '/borrowerSlips',
    orders: '/orders',
    profile: '/profile',
    forbiden403: '/403',
    notfound404user: '/*',



    //admin

    adminHome: '/admin',
    bookListAdmin: '/admin/books',
    borrowerListAdmin: '/admin/borrowers',
    onSlipAdmin: '/admin/onSlip',
    offSlipAdmin: '/admin/offSlip',
    productsAdmin: '/admin/products',
    ordersAdmin: '/admin/orders',
    statistics: '/admin/stats',
    notfound404admin: '/admin/*',
};

export default routes;
