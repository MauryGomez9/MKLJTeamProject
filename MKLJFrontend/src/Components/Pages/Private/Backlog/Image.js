import React, {Component} from 'react';

class Image extends Component
{
    render()
    {
        return (
            <img width='25px' height='50px' src={this.props.src}/>
        )
    }
}

export default Image;