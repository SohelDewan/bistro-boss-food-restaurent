const Footer = () => {
  return (
    <footer className="w-full">
      <div className="flex text-white text-center">
        <div className="bg-[#1F2937] w-1/2 p-12">
            <h2 className="text-5xl mb-6">CONTACT US</h2>
            <p>123 ABS Street, Uni 21, Bangladesh</p>
            <p><a href="tel:+880123456789">+880123456789</a> </p>
            <p>Mon - Fri: 08:00 - 22:00</p>
            <p>Sat - Sun: 10:00 - 23:00</p>
        </div>
        <div className="bg-[#111827] w-1/2 p-12">
            <h2 className="text-5xl mb-6">Follow US</h2>
            <p>Join us on social media</p>
            <img className="mx-auto mt-4 cursor-pointer" src="https://i.ibb.co/3cy00ys/sociallink.png" />
        </div>
      </div>
      <p className="bg-[#000] text-center text-white p-6 text-xl">Copyright © CulinaryCloud. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
