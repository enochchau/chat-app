"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
var Store = __importStar(require("./store"));
var WSURL = 'ws://localhost:5000/chat';
var InputBox = function (_a) {
    var onSubmit = _a.onSubmit, onChange = _a.onChange, value = _a.value;
    return (React.createElement("form", { onSubmit: onSubmit },
        React.createElement("input", { type: "text", placeholder: "Enter a message...", value: value, onChange: onChange }),
        React.createElement("input", { type: "submit", value: "send" })));
};
var App = function () {
    var _a = React.useState(''), value = _a[0], setValue = _a[1];
    var _b = React.useState([]), chatMessages = _b[0], setChatMessages = _b[1];
    var _c = React.useContext(Store.Context), state = _c.state, dispatch = _c.dispatch;
    var ws = React.useRef(null);
    var handleSubmit = function (e) {
        e.preventDefault();
        if (state.username === '') {
            dispatch({ type: "username", payload: value });
            ws.current = new WebSocket(WSURL);
            ws.current.onmessage = function (message) {
                console.log(message);
            };
        }
        else {
            // send websocket message here
        }
    };
    var handleChange = function (e) {
        setValue(e.currentTarget.value);
    };
    return (React.createElement("div", null,
        state.username === '' &&
            React.createElement("h3", null, "Please enter a username."),
        state.username !== '' &&
            React.createElement("h3", null,
                "Welcome to Websocket Land, ",
                state.username),
        React.createElement(InputBox, { onSubmit: handleSubmit, onChange: handleChange, value: value })));
};
var AppWrapper = function () {
    return (React.createElement(Store.Provider, null,
        React.createElement(App, null)));
};
ReactDOM.render(React.createElement(AppWrapper, null), document.getElementById("root"));
