import React from 'react';
import CHProfileNavigator from '../js/CHProfileNavigator';
import {configure, shallow} from 'enzyme';
import Adapter from "enzyme-adapter-react-16/build";

configure({ adapter: new Adapter() })

describe('Testing Profile Navigator', () => {
    test('Testing Loading of Profile Navigator webpage', () => {
        const wrapper = shallow(<CHProfileNavigator />, {disableLifecycleMethods: true});

        expect(wrapper.exists()).toBe(true);
    });

    test('Testing edit profile nav item', async () => {
        const handleClick = jest.fn();

        const wrapper = shallow(<CHProfileNavigator />, {disableLifecycleMethods: true});

        const instance = wrapper.instance();
        instance.handleNavItemChange(1);

        expect(instance.state.edit_profile_tag.style.display).toBe("Block");

    });

    test('Testing reviews nav item', async () => {
        const handleClick = jest.fn();

        // const profile_wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
        const wrapper = shallow(<CHProfileNavigator />, {disableLifecycleMethods: true});

        const instance = wrapper.instance();
        instance.handleNavItemChange(2);

        expect(instance.state.deactivate_tag.style.display).toBe("Block");

    });

    test('Testing courses nav item', async () => {
        const handleClick = jest.fn();

        // const profile_wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
        const wrapper = shallow(<CHProfileNavigator />, {disableLifecycleMethods: true});

        const instance = wrapper.instance();
        instance.handleNavItemChange(3);

        expect(instance.state.courses_tag.style.display).toBe("Block");

    });

    test('Testing microdegree nav item', async () => {
        const handleClick = jest.fn();

        // const profile_wrapper = shallow(<ProfilePage updateContent={handleClick}/>);
        const wrapper = shallow(<CHProfileNavigator />, {disableLifecycleMethods: true});

        const instance = wrapper.instance();
        instance.handleNavItemChange(4);

        expect(instance.state.microdegree_tag.style.display).toBe("Block");

    });
});