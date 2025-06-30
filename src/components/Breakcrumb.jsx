import React from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';

const Breadcrumb = ({ listLink = [], current }) => {
  return (
    <div>
      {listLink.map((link) => (
        <>
          <Link key={link.href} to={link.url}>
            {link.name}
          </Link>
          <MdKeyboardArrowRight />
        </>
      ))}
      <p className={'italic'}>{current}</p>
    </div>
  );
};

export default Breadcrumb;
