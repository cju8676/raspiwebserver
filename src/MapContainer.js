import React, { Component } from "react"
import { Map, GoogleApiWrapper, Status, InfoWindow, Marker } from "google-maps-react";

export class MapContainer extends Component {

    render() {
        const style = {
            width: '90%',
            height: '40%',
            display: 'inline-block'
        }

        return (
            <Map
                google={this.props.google}
                zoom={14}
                draggable={false}
                disableDoubleClickZoom={true}
                fullscreenControl={false}
                streetViewControl={false}
                mapTypeControl={false}
                style={style}
            >

                <Marker onClick={this.onMarkerClick}
                    name={'Current location'} />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyBLx7XoR2B0zshahqYMSw75oc5brf6_NNY")
})(MapContainer)
