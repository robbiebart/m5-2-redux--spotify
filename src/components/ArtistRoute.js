import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import fetchArtistProfile from "../helpers/api-helpers";

import {
  requestArtist,
  receiveArtist,
  receiveArtistError,
} from "../../actions";

export default function ArtistRoute() {
  const accessToken = useSelector((state) => state.auth.token);
  const currentArtist = useSelector((state) => state.artists.currentArtist);
  const artistStatus = useSelector((state) => state.artists.status);
  const accessStatus = useSelector((state) => state.auth.status);

  const dispatch = useDisaptch();

  const id = useParams();
  const artistId = id.artistId;

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }
    dispatch(requestArtist());

    fetchArtistProfile(accessToken, artistId)
      .then((data) => {
        dispatch(receiveArtist(data));
      })
      .catch((err) => dispatch(receiveArtistError()));
  }, [accessStatus]);

  if (currentArtist) {
    const {
      name,
      images: [{ url: primaryArtistImage }],
      followers: { total },
      genres: [firstGenre, secondGenre],
    } = currentArtist;

    return (
      <Wrapper>
        <img src={primaryArtistImage} alt="artist image" />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: black;
`;
