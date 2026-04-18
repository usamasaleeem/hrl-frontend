import { useEffect, useState } from "react";
import { useStore } from "../../../store/useStore";

export default function GeneralSettings() {
  const profile = useStore((state: any) => state.organizationProfile);
  const fetchProfile = useStore((state: any) => state.fetchOrganizationProfile);
  const updateOrg = useStore((state: any) => state.updateOrganization);

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    companySize: "",
    autoAiInterview: false,
    interviewDuration: "15",
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        industry: profile.industry || "",
        companySize: profile.companySize || "",

        // ⚠️ IMPORTANT: autoAiInterview is inside templates (based on your schema)
       autoAiInterview: profile.autoAiInterview || false,

        interviewDuration: profile.interviewDuration || "15",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateOrg(form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">General Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your company details and hiring preferences
        </p>
      </div>

      {/* Company Info */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Company Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Company Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />

          <input
            type="email"
            value={form.email}
            disabled
            className="border rounded px-3 py-2 text-sm bg-gray-100"
          />

          <input
            type="text"
            placeholder="Industry (e.g. SaaS, Fintech)"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />

          <select
            value={form.companySize}
            onChange={(e) => setForm({ ...form, companySize: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Company Size</option>
            <option value="1-10">1-10</option>
            <option value="10-50">10-50</option>
            <option value="50-200">50-200</option>
            <option value="200+">200+</option>
          </select>

        </div>
      </div>

      {/* Hiring Preferences */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Hiring Preferences
        </h2>

        {/* Auto AI Interview */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              Auto-start AI Interview
            </p>
            <p className="text-xs text-gray-500">
              Automatically send candidates to AI interview after applying
            </p>
          </div>

          <input
            type="checkbox"
            checked={form.autoAiInterview}
            onChange={(e) =>
              setForm({ ...form, autoAiInterview: e.target.checked })
            }
          />
        </div>

        {/* Interview Duration */}
        <div>
          <p className="text-sm font-medium mb-1">Interview Duration</p>
          <select
            value={form.interviewDuration}
            onChange={(e) =>
              setForm({ ...form, interviewDuration: e.target.value })
            }
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}