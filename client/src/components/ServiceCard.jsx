import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Img from './Img';
import Icon from './Icon';

export default function ServiceCard({ service }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <Link to={`/services/${service.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <Img
          src={service.image?.url}
          alt={`${service.title} service`}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon name={service.icon} className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold">
          <Link to={`/services/${service.slug}`} className="break-words hover:text-brand-600">
            {service.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Link to="/booking" className="btn-primary btn-sm">
            Book Service
          </Link>
          <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2">
            Details <ArrowRight className="h-4 w-4 transition-all" />
          </Link>
        </div>
      </div>
    </article>
  );
}
