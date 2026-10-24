import { MapPinHouse, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const createProfileState = (user) => ({
  name: user?.name || '',
  phone: user?.phone || '',
  defaultAddress: {
    fullName: user?.defaultAddress?.fullName || user?.name || '',
    phone: user?.defaultAddress?.phone || user?.phone || '',
    line1: user?.defaultAddress?.line1 || '',
    line2: user?.defaultAddress?.line2 || '',
    city: user?.defaultAddress?.city || '',
    state: user?.defaultAddress?.state || '',
    postalCode: user?.defaultAddress?.postalCode || '',
    country: user?.defaultAddress?.country || 'India',
    landmark: user?.defaultAddress?.landmark || '',
  },
});

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState(createProfileState(user));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(createProfileState(user));
  }, [user]);

  const handleRootChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      defaultAddress: {
        ...current.defaultAddress,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell py-12">
      <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-6">
          <div className="glass-card p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-ember-100 text-ember-700">
              <UserRound className="h-7 w-7" />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Profile</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-coal-900">Saved customer details</h1>
            <p className="mt-4 text-sm leading-7 text-coal-700">
              Keep your default delivery contact and address updated so checkout is faster next time.
            </p>
          </div>

          <div className="glass-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember-700">Account summary</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-coal-500">Email</p>
                <p className="mt-2 text-sm font-semibold text-coal-900">{user?.email}</p>
              </div>
              <div className="rounded-[24px] bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-coal-500">Primary phone</p>
                <p className="mt-2 text-sm font-semibold text-coal-900">{form.phone || '--'}</p>
              </div>
              <div className="rounded-[24px] bg-amber-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-coal-500">Default city</p>
                <p className="mt-2 text-sm font-semibold text-coal-900">{form.defaultAddress.city || '--'}</p>
              </div>
            </div>
          </div>
        </aside>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="glass-card p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember-100 text-ember-700">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Personal details</p>
                <h2 className="mt-1 font-display text-3xl font-bold text-coal-900">Contact information</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="label">Full name</span>
                <input className="input" name="name" onChange={handleRootChange} value={form.name} />
              </label>
              <label>
                <span className="label">Email address</span>
                <input className="input cursor-not-allowed bg-amber-50" disabled value={user?.email || ''} />
              </label>
              <label>
                <span className="label">Phone number</span>
                <input className="input" name="phone" onChange={handleRootChange} value={form.phone} />
              </label>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ember-100 text-ember-700">
                <MapPinHouse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Delivery address</p>
                <h2 className="mt-1 font-display text-3xl font-bold text-coal-900">Default shipping details</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="label">Delivery contact</span>
                <input className="input" name="fullName" onChange={handleAddressChange} value={form.defaultAddress.fullName} />
              </label>
              <label>
                <span className="label">Delivery phone</span>
                <input className="input" name="phone" onChange={handleAddressChange} value={form.defaultAddress.phone} />
              </label>
              <label>
                <span className="label">Postal code</span>
                <input className="input" name="postalCode" onChange={handleAddressChange} value={form.defaultAddress.postalCode} />
              </label>
              <label>
                <span className="label">Country</span>
                <input className="input" name="country" onChange={handleAddressChange} value={form.defaultAddress.country} />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Address line 1</span>
                <input className="input" name="line1" onChange={handleAddressChange} value={form.defaultAddress.line1} />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Address line 2</span>
                <input className="input" name="line2" onChange={handleAddressChange} value={form.defaultAddress.line2} />
              </label>
              <label>
                <span className="label">City</span>
                <input className="input" name="city" onChange={handleAddressChange} value={form.defaultAddress.city} />
              </label>
              <label>
                <span className="label">State</span>
                <input className="input" name="state" onChange={handleAddressChange} value={form.defaultAddress.state} />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Landmark</span>
                <input className="input" name="landmark" onChange={handleAddressChange} value={form.defaultAddress.landmark} />
              </label>
            </div>
          </div>

          <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-coal-700">
                These details will be used to prefill checkout and order delivery forms.
              </p>
            </div>

            <Button disabled={submitting} type="submit" variant="accent">
              {submitting ? 'Saving profile...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
