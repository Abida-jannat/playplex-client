import Banner from "@/components/Banner";
import Image from "next/image";
import FeaturedFacilities from "@/components/FeaturedFacilities";

export default function Home() {
  return (
    <main>
      <Banner></Banner>
     
      <FeaturedFacilities></FeaturedFacilities>
    </main>
  );
}
