import React from 'react';
import './ImageLinkForm.css'; 

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    }
}

class ImageLinkForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	} 

	loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://evening-dawn-04162.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://evening-dawn-04162.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log);

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
    })
      .catch(err => console.log(err));
  }

	handleKeyPress = (event) => {
		if(event.charCode === 13) {
			console.log("pressed a key");
		    this.setState({imageUrl: this.state.input});
		      fetch('https://evening-dawn-04162.herokuapp.com/imageurl', {
		        method: 'post',
		        headers: {'Content-Type': 'application/json'},
		        body: JSON.stringify({
		          input: this.state.input
		        })
		      })
		      .then(response => response.json())
		      .then(response => {
		        if (response) {
		          fetch('https://evening-dawn-04162.herokuapp.com/image', {
		            method: 'put',
		            headers: {'Content-Type': 'application/json'},
		            body: JSON.stringify({
		              id: this.state.user.id
		            })
		          })
		          .then(response => response.json())
		          .then(count => {
		            this.setState(Object.assign(this.state.user, { entries: count }))
		            })
		            .catch(console.log);

		        }
		        this.displayFaceBox(this.calculateFaceLocation(response))
		    })
		      .catch(err => console.log(err));
  		}
	}

render() {
	return (
		<div>
			<p className='f3'>
				{'This Magic Brain will detect faces in your pictures. Give it a try.'}
			</p>
			<div className='center'>
				<div 
				className='form center pa4 br3 shadow-5'>
					<input 
						className='f4 pa2 w-70 center' 
						type='text' 
						onChange={this.onInputChange}
						onKeyPress = {this.handleKeyPress}
					/>
					<button
						className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
						onClick={this.onButtonSubmit}
					>Detect</button>

				</div>
			</div>
		</div>
	);
}
}


export default ImageLinkForm;