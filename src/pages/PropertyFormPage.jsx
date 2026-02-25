import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAppData } from '../hooks/useAppData';

const initial = {
  city: '',
  state: '',
  propertyType: '',
  size: '',
  budget: '',
  rooms: '',
  propertyAge: '',
  floor: '',
  parking: '',
  balcony: ''
};

const textOnly = /^[A-Za-z ]+$/;

export default function PropertyFormPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const { savePropertyForm } = useAppData();
  const navigate = useNavigate();

  const input = 'w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2';
  const errorInput = 'border-red-500';

  const onTextChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const onNumberChange = (key, value) => {
    const numeric = value.replace(/[^\d]/g, '');
    setForm((prev) => ({ ...prev, [key]: numeric }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.city.trim()) next.city = 'City is required.';
    else if (!textOnly.test(form.city.trim())) next.city = 'City must contain letters only.';

    if (!form.state.trim()) next.state = 'State is required.';
    else if (!textOnly.test(form.state.trim())) next.state = 'State must contain letters only.';

    if (!form.propertyType.trim()) next.propertyType = 'Property type is required.';
    if (!form.size.trim()) next.size = 'Size is required.';
    if (!form.budget.trim()) next.budget = 'Budget is required.';
    if (!form.rooms.trim()) next.rooms = 'Rooms is required.';
    if (!form.propertyAge.trim()) next.propertyAge = 'Property age is required.';
    if (!form.floor.trim()) next.floor = 'Floor is required.';
    if (!form.parking.trim()) next.parking = 'Parking selection is required.';
    if (!form.balcony.trim()) next.balcony = 'Balcony selection is required.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl glass rounded-3xl p-8">
        <h1 className="text-2xl font-bold">Property Form</h1>
        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!validate()) return;

            await savePropertyForm({
              ...form,
              size: Number(form.size),
              budget: Number(form.budget),
              rooms: Number(form.rooms),
              propertyAge: Number(form.propertyAge),
              floor: Number(form.floor)
            });
            navigate('/recommendations');
          }}
        >
          <div>
            <input
              className={`${input} ${errors.city ? errorInput : ''}`}
              placeholder="City (e.g., Pune)"
              value={form.city}
              onChange={(e) => onTextChange('city', e.target.value)}
            />
            {errors.city ? <p className="mt-1 text-xs text-red-500">{errors.city}</p> : null}
          </div>

          <div>
            <input
              className={`${input} ${errors.state ? errorInput : ''}`}
              placeholder="State (e.g., Maharashtra)"
              value={form.state}
              onChange={(e) => onTextChange('state', e.target.value)}
            />
            {errors.state ? <p className="mt-1 text-xs text-red-500">{errors.state}</p> : null}
          </div>

          <div>
            <select
              className={`${input} ${errors.propertyType ? errorInput : ''}`}
              value={form.propertyType}
              onChange={(e) => onTextChange('propertyType', e.target.value)}
            >
              <option value="">Select Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
            </select>
            {errors.propertyType ? <p className="mt-1 text-xs text-red-500">{errors.propertyType}</p> : null}
          </div>

          <div>
            <input
              className={`${input} ${errors.size ? errorInput : ''}`}
              placeholder="Size (sq.ft)"
              value={form.size}
              onChange={(e) => onNumberChange('size', e.target.value)}
            />
            {errors.size ? <p className="mt-1 text-xs text-red-500">{errors.size}</p> : null}
          </div>

          <div>
            <input
              className={`${input} ${errors.budget ? errorInput : ''}`}
              placeholder="Budget (numbers only)"
              value={form.budget}
              onChange={(e) => onNumberChange('budget', e.target.value)}
            />
            {errors.budget ? <p className="mt-1 text-xs text-red-500">{errors.budget}</p> : null}
          </div>

          <div>
            <input
              className={`${input} ${errors.rooms ? errorInput : ''}`}
              placeholder="Rooms (numbers only)"
              value={form.rooms}
              onChange={(e) => onNumberChange('rooms', e.target.value)}
            />
            {errors.rooms ? <p className="mt-1 text-xs text-red-500">{errors.rooms}</p> : null}
          </div>

          <div>
            <input
              className={`${input} ${errors.propertyAge ? errorInput : ''}`}
              placeholder="Property Age (years)"
              value={form.propertyAge}
              onChange={(e) => onNumberChange('propertyAge', e.target.value)}
            />
            {errors.propertyAge ? <p className="mt-1 text-xs text-red-500">{errors.propertyAge}</p> : null}
          </div>

          <div>
            <input
              className={`${input} ${errors.floor ? errorInput : ''}`}
              placeholder="Floor (numbers only)"
              value={form.floor}
              onChange={(e) => onNumberChange('floor', e.target.value)}
            />
            {errors.floor ? <p className="mt-1 text-xs text-red-500">{errors.floor}</p> : null}
          </div>

          <div>
            <select
              className={`${input} ${errors.parking ? errorInput : ''}`}
              value={form.parking}
              onChange={(e) => onTextChange('parking', e.target.value)}
            >
              <option value="">Parking Available?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.parking ? <p className="mt-1 text-xs text-red-500">{errors.parking}</p> : null}
          </div>

          <div className="md:col-span-2">
            <select
              className={`${input} ${errors.balcony ? errorInput : ''}`}
              value={form.balcony}
              onChange={(e) => onTextChange('balcony', e.target.value)}
            >
              <option value="">Balcony Available?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.balcony ? <p className="mt-1 text-xs text-red-500">{errors.balcony}</p> : null}
          </div>

          <button className="md:col-span-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white">
            Get Recommendations
          </button>
        </form>
      </div>
    </Layout>
  );
}
