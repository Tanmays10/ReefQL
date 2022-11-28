import { gql } from "@apollo/client";


const GET_MISSIONS = gql`
query Missions {
  missions {
    name
    website
    manufacturers
    # payloads {
    #   orbit
    #   nationality
    #   manufacturer
    # }
  }
}
`;

export { GET_MISSIONS };