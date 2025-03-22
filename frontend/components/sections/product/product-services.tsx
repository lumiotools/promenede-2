"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductsServicesProps = {
  initialData?: Service[] | null;
};

interface Service {
  uuid: string | null;
  value: string | null;
  image_id: string | null;
  permalink: string | null;
  entity_def_id: string | null;
}

export default function ProductsServices({
  initialData = [],
}: ProductsServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(-1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedService, setEditedService] = useState<Service | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newService, setNewService] = useState<Service>({
    uuid: null,
    value: "",
    image_id: null,
    permalink: null,
    entity_def_id: "category",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate API fetch
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setServices(initialData || []);
      setIsLoading(false);
      if (initialData && initialData.length > 0) {
        setSelectedServiceIndex(0);
      }
    };

    fetchData();
  }, [initialData]);

  const handleSelectService = (index: number) => {
    setSelectedServiceIndex(index);
  };

  const handleEditClick = () => {
    if (selectedServiceIndex >= 0) {
      setEditedService({ ...services[selectedServiceIndex] });
      setIsEditing(true);
    }
  };

  const handleEditChange = (field: keyof Service, value: string) => {
    if (editedService) {
      setEditedService({ ...editedService, [field]: value });
    }
  };

  const handleSaveEdit = () => {
    if (editedService && selectedServiceIndex >= 0) {
      const updatedServices = [...services];
      updatedServices[selectedServiceIndex] = editedService;
      setServices(updatedServices);
      setIsEditing(false);
      setEditedService(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedService(null);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleNewServiceChange = (field: keyof Service, value: string) => {
    setNewService({ ...newService, [field]: value });
  };

  const handleSaveNew = () => {
    if (newService.value) {
      const newServiceWithId = {
        ...newService,
        uuid: `new-${Date.now()}`, // Generate a temporary UUID
        permalink: newService.value?.toLowerCase().replace(/\s+/g, "-") || null,
      };

      const updatedServices = [...services, newServiceWithId];
      setServices(updatedServices);
      setSelectedServiceIndex(updatedServices.length - 1);
      setIsAddingNew(false);
      setNewService({
        uuid: null,
        value: "",
        image_id: null,
        permalink: null,
        entity_def_id: "category",
      });
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewService({
      uuid: null,
      value: "",
      image_id: null,
      permalink: null,
      entity_def_id: "category",
    });
  };

  const handleDeleteClick = (index: number) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${services[index].value}"?`
      )
    ) {
      const updatedServices = [...services];
      updatedServices.splice(index, 1);
      setServices(updatedServices);

      if (selectedServiceIndex === index) {
        setSelectedServiceIndex(updatedServices.length > 0 ? 0 : -1);
      } else if (selectedServiceIndex > index) {
        setSelectedServiceIndex(selectedServiceIndex - 1);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            Products & Services
          </h1>
        </div>
        <Card className="w-full">
          <CardContent className="p-8 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">Loading services...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-slate-800">
          Products & Services
        </h1>
        <Button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary/90"
          disabled={isEditing || isAddingNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="border-b bg-slate-50 px-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-medium text-slate-700">
              {isEditing
                ? "Edit Service"
                : isAddingNew
                ? "Add New Service"
                : "Service Categories"}
            </CardTitle>
            {!isEditing && !isAddingNew && selectedServiceIndex >= 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="text-slate-600 hover:text-slate-900 border-slate-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(selectedServiceIndex)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-slate-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isEditing && editedService ? (
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Service Name
                </label>
                <Input
                  value={editedService.value || ""}
                  onChange={(e) => handleEditChange("value", e.target.value)}
                  className="max-w-md"
                  placeholder="Enter service name"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editedService.value}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="text-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : isAddingNew ? (
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Service Name
                </label>
                <Input
                  value={newService.value || ""}
                  onChange={(e) =>
                    handleNewServiceChange("value", e.target.value)
                  }
                  className="max-w-md"
                  placeholder="Enter service name"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleSaveNew}
                  disabled={!newService.value}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelNew}
                  className="text-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <div
                    key={service.uuid || index}
                    onClick={() => handleSelectService(index)}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        selectedServiceIndex === index
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-800">
                        {service.value}
                      </h3>
                      <Badge variant="outline" className="text-xs font-normal">
                        {service.entity_def_id || "category"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-slate-500">
                  <p>
                    No services found. Click &quot;Add Service&quot; to create
                    one.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-sm text-slate-500">
        Source: 1.PromenadeAI, 2.Crunchbase
      </div>
    </div>
  );
}
