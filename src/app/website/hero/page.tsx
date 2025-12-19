'use client';

import { Button, Modal, Switch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
// import { useGetHeroSectionsQuery, useAddHeroSectionMutation, useUpdateHeroSectionMutation, useDeleteHeroSectionMutation } from '../services/heroSectionApi';
import { DynamicTable, HeroSection } from 'src/shared';
import { useAddHeroSectionMutation, useDeleteHeroSectionMutation, useGetHeroSectionsQuery, useUpdateHeroSectionMutation } from 'src/shared/api/apiSlice';
import { HeroSectionForm } from './_herofComponent/hero-form';

export default function Hero() {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [selectedHeroSection, setSelectedHeroSection] = useState<HeroSection | null>(null);
  const [isAddModalOpen, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [isEditModalOpen, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const { data: fetchedHeroSections, isLoading, refetch } = useGetHeroSectionsQuery();
  const [addHeroSection] = useAddHeroSectionMutation();
  const [updateHeroSection] = useUpdateHeroSectionMutation();
  const [deleteHeroSection] = useDeleteHeroSectionMutation();

  useEffect(() => {
    if (fetchedHeroSections) {
      setHeroSections(fetchedHeroSections);
    }
  }, [fetchedHeroSections]);

  const handleAdd = async (newHeroSection: Omit<HeroSection, 'id'>) => {
    await addHeroSection(newHeroSection);
    refetch();
    closeAddModal();
  };

  const handleEdit = async (updatedHeroSection: Omit<HeroSection, 'id'>) => {
    if (selectedHeroSection) {
      await updateHeroSection({ ...updatedHeroSection, id: selectedHeroSection.id });
      refetch();
      closeEditModal();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteHeroSection(id);
    refetch();
  };

  const handleToggleActive = async (heroSection: HeroSection) => {
    await updateHeroSection({ ...heroSection, isActive: !heroSection.isActive });
    refetch();
  };

  const columns = [
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'subtitle',
      header: 'Subtitle',
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }: { row: { original: HeroSection } }) => (
        <Switch
          checked={row.original.isActive}
          onChange={() => handleToggleActive(row.original)}
        />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: HeroSection } }) => (
        <div className="flex space-x-2">
          <Button onClick={() => {
            setSelectedHeroSection(row.original);
            openEditModal();
          }}>
            Edit
          </Button>
          <Button color="red" onClick={() => handleDelete(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={openAddModal} className="mb-4">Add New Hero Section</Button>

      <DynamicTable
        data={heroSections}
        columns={columns}
        // isLoading={isLoading}
      />

      <Modal opened={isAddModalOpen} onClose={closeAddModal} title="Add New Hero Section">
        <HeroSectionForm onSubmit={handleAdd} onCancel={closeAddModal} />
      </Modal>

      <Modal opened={isEditModalOpen} onClose={closeEditModal} title="Edit Hero Section">
        {selectedHeroSection && (
          <HeroSectionForm
            initialData={selectedHeroSection}
            onSubmit={handleEdit}
            onCancel={closeEditModal}
          />
        )}
      </Modal>
    </div>
  );
}