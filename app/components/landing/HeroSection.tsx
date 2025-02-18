import { NavLink } from "@remix-run/react";
import { useEffect, useState } from "react";

export function HeroSection() {
  function activeLinkStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }
  return (
    // <div className=" bg-[url('/assets/kawaiibg.png')] bg-no-repeat bg-cover md:bg-contain bg-[center_bottom_0rem] h-[50vh] md:h-[85vh] flex flex-col items-center justify-start py-10 md:py-28">
    //   <h1 className="text-4xl md:text-6xl text-center herofont flex items-center justify-center flex-col md:flex-row gap-2 md:gap-7 px-20">
    //     <span>Collection of Hot Finds</span>
    //     <span className="text-3xl hidden md:block">❖</span>
    //     <span>Discover Unique Pieces</span>
    //     <span className="text-3xl hidden md:block">❖</span>
    //     <span>Shop your Style</span>
    //   </h1>
    //   {/* <p>Your one-stop shop for all things pixi!</p> */}
    // </div>
    <div className="bg-[url('/assets/bgcloud.png')] bg-no-repeat bg-cover md:bg-cover bg-[center_bottom_0rem] h-[50vh] md:h-[105vh] flex flex-col items-center justify-start py-10 md:py-28">
      <img src="/assets/hero.png" width={350} height={350} alt="kawaii background" className="m-auto" />
      <section>
        <ul className='flex flex-row gap-8 py-12'>
          <li>
            <NavLink
              className="header-menu-itemxxx px-8 py-4 text-xl font-semibold bg-[#F9F5E2]"
              end
              style={activeLinkStyle}
              to={'/collections/'}
            >
              New Arrivals
            </NavLink>
          </li>
          <li>
            <NavLink
              className="header-menu-itemxx px-8 py-4 text-xl font-semibold bg-[#F9F5E2]"
              end
              to={'/collections/'}
            >
              Hot Items
            </NavLink>
          </li>
          <li>
            <NavLink
              className="header-menu-itemxx px-8 py-4 text-xl font-semibold bg-[#F9F5E2]"
              end
              to={'/collections/'}
            >
              Categories
            </NavLink>
          </li>
        </ul>
      </section>
      <img src="/assets/lappy.png" width={350} height={350} alt="kawaii background" className="m-auto" />
      <NavLink
        className="header-menu-itemxx px-8 py-4 text-2xl font-semibold bg-[#F9F5E2] shadow-md"
        end
        to={'/collections/'}
      >
       Shop All
      </NavLink>
    </div>
  );
}
