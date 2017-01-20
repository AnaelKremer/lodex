import App from './App';
import adminRoutes from './admin/routes';
import homeRoutes from './home/routes';

export default store => ({
    childRoutes: [{
        path: '/',
        component: App,
        indexRoute: { onEnter: (nextState, replace) => replace('/home') },
        childRoutes: [
            ...homeRoutes,
            ...adminRoutes,
        ],
    }],
});
