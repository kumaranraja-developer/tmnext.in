import Mainmenu from "@/UIBlocks/Mainmenu";
import ProductCard from "@/UIBlocks/ProductCard";
import BannerCarousel from "@/UIBlocks/BannerCarousel";
import GroupProductCard from "@/UIBlocks/GroupProductCard";

function Home() {
 
  return (
    <div>
      <Mainmenu />
      <BannerCarousel api={`api/resource/Product?fields=["name"]&filters=[["is_slider", "=", 1]]`} delay={6000} />
      <ProductCard title="Popular Items" api={`api/resource/Product?fields=["name"]&filters=[["is_popular", "=", 1]]`} ribbon={true}  />
      <div className="flex flex-col md:flex-row gap-5 px-[5%]">
        <GroupProductCard title={"Hot Gadgets Today"} api={`api/resource/Product?fields=["name"]&filters=[["top_rated", "=", 1]]`} />
        <GroupProductCard
          title="Discount for you"
          api={`api/resource/Product?fields=["name"]&filters=[["is_discount", "=", 1]]`}
        />
     
      </div>
      <ProductCard title="Laptops" api={`api/resource/Product?fields=["name"]&filters=[["is_popular", "=", 1]]`}/>

       <div className="flex flex-col md:flex-row gap-5 px-[5%]">
        <GroupProductCard title={"Top Rated"} api={`api/resource/Product?fields=["name"]&filters=[["top_rated", "=", 1]]`} />
        <GroupProductCard
          title="Best Sellers"
          api={`api/resource/Product?fields=["name"]&filters=[["is_discount", "=", 1]]`}
        />
          <GroupProductCard
          title="BlockBuster Deals"
          api={`api/resource/Product?fields=["name"]&filters=[["is_discount", "=", 1]]`}
          ribbon={true}
        />
      </div>
      {/* <AdvertisementBanner /> */}
    </div>
  );
}

export default Home;
