import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { humanizeNumber } from "../Utils";

import { fetchArtistProfile } from "../helpers/api-helpers";

import { requestArtist, receiveArtist, receiveArtistError } from "../actions";

export default function ArtistRoute() {
  const accessToken = useSelector((state) => state.auth.token);
  const currentArtist = useSelector((state) => state.artists.currentArtist);
  const artistStatus = useSelector((state) => state.artists.status);
  const accessStatus = useSelector((state) => state.auth.status);

  const dispatch = useDispatch();

  const id = useParams();
  const artistId = id.artistId;

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }
    dispatch(requestArtist());

    fetchArtistProfile(accessToken, artistId)
      .then((data) => {
        console.log("before dispatch data", data);
        dispatch(receiveArtist(data));
      })
      .catch((err) => dispatch(receiveArtistError()));
  }, [accessToken]);

  if (currentArtist) {
    const {
      name,
      images: [{ url: primaryArtistImage }],
      followers: { total },
      genres: [firstGenre, secondGenre],
    } = currentArtist;

    const readableNumber = humanizeNumber(total);

    return (
      <Wrapper>
        <ArtistInfo>
          <p>{name}</p>
          <p>{readableNumber} followers</p>
          <p>Tags</p>
          <p>
            {firstGenre}
            {secondGenre}
          </p>
        </ArtistInfo>
        <ArtistImg src={primaryArtistImage} alt="artist image" />
      </Wrapper>
    );
  } else {
    return <div>Loading...</div>;
  }
}

const Wrapper = styled.div`
  background: lightgray;
  height: 100vh;
  width: 100%;

  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto;
`;

const ArtistImg = styled.img`
  grid-column-start: 2;
  grid-row-start: 2;
`;

const ArtistInfo = styled.div`
  grid-column-start: 2;
  grid-row-start: 1;
`;
