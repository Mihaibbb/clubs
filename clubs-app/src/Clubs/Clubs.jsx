import { useParams } from "react-router";

export default function Clubs() {
    const params = useParams();
    console.log(params.id);

};