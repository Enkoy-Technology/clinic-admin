import { Button, Checkbox, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { HeroSection } from 'src/shared';

interface HeroSectionFormProps {
  initialData?: HeroSection;
  onSubmit: (data: Omit<HeroSection, 'id'>) => void;
  onCancel: () => void;
}

export function HeroSectionForm({ initialData, onSubmit, onCancel }: HeroSectionFormProps) {
  const form = useForm({
    initialValues: initialData || {
      type: 'image' as 'image' | 'video',
      src: '',
      title: '',
      subtitle: '',
      isActive: false,
    },
    validate: {
      src: (value) => (value ? null : 'Source is required'),
      title: (value) => (value ? null : 'Title is required'),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values as Omit<HeroSection, 'id'>);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Type"
        placeholder="Select type"
        data={[
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Video' },
        ]}
        {...form.getInputProps('type')}
      />
      <TextInput
        label="Source URL"
        placeholder="Enter source URL"
        {...form.getInputProps('src')}
      />
      <TextInput
        label="Title"
        placeholder="Enter title"
        {...form.getInputProps('title')}
      />
      <TextInput
        label="Subtitle"
        placeholder="Enter subtitle"
        {...form.getInputProps('subtitle')}
      />
      <Checkbox
        label="Active"
        {...form.getInputProps('isActive', { type: 'checkbox' })}
      />
      <Group justify="flex-end" mt="md">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}