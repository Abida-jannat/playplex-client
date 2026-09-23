import Banner from "@/components/Banner";
import Image from "next/image";
import FeaturedFacilities from "@/components/FeaturedFacilities";
import SportCategories from "@/components/SportCategories";
import States from "@/components/States";

export default function Home() {
  return (
    <main>
      <Banner>

      </Banner>

      <FeaturedFacilities></FeaturedFacilities>
      <SportCategories></SportCategories>
     <States></States>
      </main>
  );
}
