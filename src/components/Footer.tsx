import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="w-full relative bg-[#F6D684] flex p-10 flex-col items-center gap-10">
      <div className="w-full flex items-center px-10">
        <div className="w-[150px] cursor-pointer">
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-full object-cover"
          />
        </div>
      </div>
      <div className="w-full flex justify-between gap-10">
        <ul className="flex flex-col gap-5">
          <li className="big-heading-3">Real Estate</li>
          <li>
            <p className="text-2">
              As a new client of G.R. Traders, we were delighted with their
              dedication to quality and prompt delivery. Despite a market
              shortage, they successfully procured the required goods.
            </p>
          </li>
          <li className="mt-10">
            <div className="flex gap-5">
              <a
                href=""
                className=" rounded-2xl w-[70px] h-[70px] cursor-pointer p-5 flex justify-center items-center bg-[#3E3E3E]"
              >
                <img src="/images/Facebook_Logo.svg" alt="Facebook" />
              </a>
              <a className=" rounded-2xl cursor-pointer  w-[70px] h-[70px] p-5 flex justify-center items-center bg-[#3E3E3E]">
                <img src="/images/Youtube_Logo.svg" alt="YouTube" />
              </a>
              <a className=" rounded-2xl cursor-pointer  w-[70px] h-[70px] p-5 flex justify-center items-center bg-[#3E3E3E]">
                <img src="/images/Linkdin_Logo.svg" alt="LinkedIn" />
              </a>
              <a className=" rounded-2xl cursor-pointer  w-[70px] h-[70px] p-5 flex justify-center items-center bg-[#3E3E3E]">
                <img src="/images/Instagram_Logo.svg" alt="Instagram" />
              </a>
            </div>
          </li>
        </ul>
        <ul className="flex flex-col gap-5">
          <li className="text-2xl font-bold">Company</li>
          <li className="text">Our Adents</li>
          <li className="text">FAQs</li>
          <li className="text">Testimonials</li>
          <li className="text">About Us</li>
          <li className="text">Contact Us</li>
        </ul>
        <ul className="flex flex-col gap-5">
          <li className="text-2xl font-bold">Contact</li>
          <li className="text">+1-393020,333</li>
          <li className="text">Example@gmail.com</li>
          <li className="text">23423 jhdl, jnefk wefnj, 2u3, royal City</li>
        </ul>
        <ul className="flex flex-col w-fit gap-10">
          <li className="text-2xl font-bold">Get the Latest Info</li>
          <li>
            <div className="w-[400px] bg-white rounded-lg flex items-center overflow-hidden">
              <input
                type="text"
                className="w-[75%] outline-none pl-10 h-full text-lg"
                placeholder="Email"
              />
              <button className="button h-full w-[25%] flex justify-center items-center py-6">
                <img
                  src="/images/Send.svg"
                  alt="Send"
                  className="object-cover object-center w-[20px]"
                />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
