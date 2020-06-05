import React from 'react'
import { shallow } from 'enzyme'
import Modal from './Modal'

describe('Test Modal', () => {

    let wrapper;
    const closeMockFn = jest.fn()
    const children = <div>
        <h3 key = "title">Modal Title</h3>
        <p key = "body">Modal Body</p>
        <div id = "footer" key = "footer">Modal Footer</div>
    </div>

    beforeEach(() => {
        wrapper = shallow(<Modal 
            onClose = {closeMockFn}
        >
            { children }
        </Modal>)
    })

    test('Test close button', () => {
        expect(wrapper.find('#close-button')).toHaveLength(1)
        wrapper.find('#close-button').simulate('click')
        expect(closeMockFn).toHaveBeenCalled()
    })

    test('renders passed children', () => {
        expect(wrapper.find('h3').text()).toBe('Modal Title')

        expect(wrapper.find('p').text()).toBe('Modal Body')

        expect(wrapper.find('#footer').text()).toBe('Modal Footer')
    })
})