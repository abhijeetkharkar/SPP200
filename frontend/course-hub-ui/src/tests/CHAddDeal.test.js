import React from 'react';
import CHAddDeal from '../js/CHAddDeal';
import { shallow } from 'enzyme';
import { addDeal } from '../elasticSearch';
import { error } from 'util';
const elastic = require('../elasticSearch');
jest.mock('../elasticSearch');

// Testing Loading of Deals Page 
test('Loading Add Deal Page ', () => {
    const wrapper = shallow(<CHAddDeal />);
    expect(wrapper.exists()).toBe(true);
})


test('handle provider change - pluralsight ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "PluralSight"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fpluralsight.png?alt=media&token=08635c9a-5b85-4bfb-8334-0fe6fc9dfd97");
})

test('handle provider change - Udemy ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "Udemy"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fudemy.png?alt=media&token=0baa8ef1-3f79-4be9-b96e-20fccd7934c8");
})

test('handle provider change - EDX ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "EDX"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fedx.jpg?alt=media&token=713c5220-222a-402a-b8d3-d7ba9db15991");
})

test('handle provider change - Coursera ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "Coursera"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fcoursera.png?alt=media&token=42504f25-018c-4084-b3ed-b556a0d8c400");
})

test('handle provider change - Udacity ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "Udacity"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fudacity.jpg?alt=media&token=fbfe7041-eb87-4bde-bfd5-181e0c9a1487");
})

test('handle provider change - Iversity ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "Iversity"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fiversity.png?alt=media&token=a08c29dd-cf68-43c5-8207-5566f55b4207");
})

test('handle provider change - Open Learning ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "Open Learning"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2FOpenLearning.png?alt=media&token=8afe1c0c-677b-437c-a6bc-c66c01590340");
})

test('handle provider change - Default ', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value : "dEFAULT"
        }
    };
    instance.handleProviderChange(event);
    expect(instance.state.imageLink).toBe("https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2F276*180px.svg?alt=media&token=0d8e5d9d-9087-4135-944b-fe9b87b96fb0");
})

test('form submission handling - successfull ', async () => {
    const updatePage = jest.fn();
    const event = { preventDefault: jest.fn() };
    elastic.addDeal.mockImplementationOnce(() => {
        return Promise.resolve(true);
    });
    const wrapper = shallow(<CHAddDeal updatePage={updatePage}/>);
    const instance = wrapper.instance();
    
    try {
        await instance.handleSubmit(event);
    } catch (e) {
        expect(e).toMatch('error');
    }
})

test('form submission handling - unsuccessfull ', async () => {
    const updatePage = jest.fn();
    const event = { preventDefault: jest.fn() };
    elastic.addDeal.mockImplementationOnce(() => {
        return Promise.resolve(false);
    });
    const wrapper = shallow(<CHAddDeal updatePage={updatePage}/>);
    const instance = wrapper.instance();
    
    try {
        await instance.handleSubmit(event);
    } catch (e) {
        expect(e).toMatch('error');
    }
})

test('form submission handling - error ', async () => {
    const updatePage = jest.fn();
    const event = { preventDefault: jest.fn() };
    elastic.addDeal.mockImplementationOnce(() => {
        throw error
    });
    const wrapper = shallow(<CHAddDeal updatePage={updatePage}/>);
    const instance = wrapper.instance();
    
    try {
        await instance.handleSubmit(event);
    } catch (e) {
        expect(e).toMatch('error');
    }
})

test('handle title change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default"
        }
    };
    instance.handleTitleChange(event);
    expect(instance.state.title).toBe("default");
})

test('handle description change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default description"
        }
    };
    instance.handleDescriptionChange(event);
    expect(instance.state.description).toBe("default description");
})

test('handle link change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default link"
        }
    };
    instance.handleLinkChange(event);
    expect(instance.state.link).toBe("default link");
})

test('handle original price change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default price"
        }
    };
    instance.handleOriginalPriceChange(event);
    expect(instance.state.originalPrice).toBe("default price");
})

test('handle discounted price change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default price"
        }
    };
    instance.handleDiscountedPriceChange(event);
    expect(instance.state.discountedPrice).toBe("default price");
})

test('handle category price change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default category"
        }
    };
    instance.handleCategoryChange(event);
    expect(instance.state.category).toBe("default category");
})

test('handle deal expiry change update', () => {
    const wrapper = shallow(<CHAddDeal />);
    const instance = wrapper.instance();

    const event = {
        target: {
            value: "default expiry"
        }
    };
    instance.handleDealExpiryChange(event);
    expect(instance.state.dealExpiry).toBe("default expiry");
})