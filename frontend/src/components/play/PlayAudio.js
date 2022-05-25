import React from "react";
import ReactAudioPlayer from "react-audio-player";

const musicTracks = [
  {
    name: "Circle",
    src: "Circle Dance - SefChol.mp3",
  },
  {
    name: "Come on",
    src: "Come On Out - Dan Lebowitz.mp3",
  },
  {
    name: "Funk Cool",
    src: "Funk Cool Groove.mp3",
  },
  {
    name: "Swing House",
    src: "Swing House - RKVC.mp3",
  },
  {
    name: "Twisted Bandits",
    src: "Twisted Bandits All Around Me - NoMBe.mp3",
  },
  {
    name: "Two Little Bums",
    src: "Two Little Bums - The Great North Sound Society.mp3",
  },
  {
    name: "We Ride!",
    src: "We Ride! - Reed Mathis.mp3",
  },
];

function PlayAudio({ number }) {
  return (
    <div>
      <ReactAudioPlayer
        src={musicTracks[number].src}
        autoPlay
        controls
        // style={{ width: "130px" }}
        loop={true}
      ></ReactAudioPlayer>
    </div>
  );
}

export default PlayAudio;
