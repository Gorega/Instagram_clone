import Layout from "./peopleModal/Layout";

export default function PeopleLikes({peopleLikes}){

    return <Layout
        title="Likes"
        people={peopleLikes}
        type="peopleLikes"
    />

}