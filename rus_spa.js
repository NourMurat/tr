 

const createElementByName = (className, description, tagName) => {
    const newDiv = document.createElement(tagName)
    newDiv.classList.add(className);
    newDiv.textContent = description;
    return newDiv;
}

const createNavBar = () => {
    const NavBarContainer = createElementByName('container', '', 'section');
    const root = document.getElementById('root');
    root.appendChild(NavBarContainer);
}
const createBody = () => {
    const NavBarContainer = createElementByName('selectUser', '', 'section');
    const root = document.getElementById('root');
    root.appendChild(NavBarContainer);
}
const createFooter = () => {
    const NavBarContainer = createElementByName('dungeon', '', 'section');
    const root = document.getElementById('root');
    root.appendChild(NavBarContainer);
}

addToComponents(createBody, createNavBar, createFooter);

const StateManager = (initialValue) => {
    let state = initialValue;
    const components = []
    const setState = (newState) => {
        state = newState;
    }
    const getState = () => {
        return state;
    }
    const addToComponents = (...func) => {
        components.push(func)
    }
    const render = () => {
        components.forEach((func)=>func())
    }
    return [getState, setState, addToComponents]
}

class StateManager {
    constructor(){
        let state = 0;
        const components = [];
    }
    setState = (newState) => {
        this.state = newState;
    }
    getState = () => {
        return this.state;
    }
    addToComponents = (...func) => {
        this.components.push(func)
    }
    render = () => {
        this.components.forEach((func)=>func())
    }
}

const [getState, setState, addToComponents] = StateManager(0)
add

const mainRoute = createElementByName('kek', 'cheburek', 'span')
`