import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, InputNumber, Button, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { needApi } from '../api/need';
import { useToast } from '../components/Toast';
import { STUDY_TYPE_MAP, LOCATION_TYPE_MAP } from '../types';

/** 生成从 startHour:00 到 endHour:00 每 30 分钟一个选项 */
const generateTimeOptions = () => {
  const opts: { label: string; value: string }[] = [];
  for (let h = 6; h <= 23; h++) {
    for (const m of [0, 30]) {
      if (h === 23 && m === 30) continue;
      const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      opts.push({ label: val, value: val });
    }
  }
  return opts;
};

const TIME_OPTIONS = generateTimeOptions();

const schema = z.object({
  title: z.string().min(1, '请输入标题').max(50, '标题最长50字'),
  courseName: z.string().min(1, '请选择或输入课程'),
  studyType: z.string().min(1, '请选择学习类型'),
  studyDate: z.any().refine((v) => v, '请选择学习日期'),
  startTime: z.string().min(1, '请选择开始时间'),
  endTime: z.string().min(1, '请选择结束时间'),
  locationType: z.string().min(1, '请选择地点类型'),
  locationDetail: z.string().optional(),
  description: z.string().max(500, '描述最长500字').optional(),
  partnerCount: z.number().min(1).max(5),
});

type FormData = z.infer<typeof schema>;

export default function CreateNeedPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationType, setLocationType] = useState('');

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { partnerCount: 1, locationType: '', locationDetail: '', description: '', startTime: '', endTime: '' },
  });

  const watchLocationType = watch('locationType');
  const watchStartTime = watch('startTime');
  useEffect(() => { setLocationType(watchLocationType); }, [watchLocationType]);

  const endTimeOptions = useMemo(() => {
    if (!watchStartTime) return TIME_OPTIONS;
    return TIME_OPTIONS.filter((opt) => opt.value > watchStartTime);
  }, [watchStartTime]);
  useEffect(() => { needApi.searchCourses().then(setCourses); }, []);

  useEffect(() => {
    if (isEdit) {
      needApi.getById(Number(id)).then(({ need }) => {
        setValue('title', need.title);
        setValue('courseName', need.courseName);
        setValue('studyType', need.studyType);
        setValue('studyDate', dayjs(need.studyDate));
        setValue('startTime', need.startTime);
        setValue('endTime', need.endTime);
        setValue('locationType', need.locationType);
        setValue('locationDetail', need.locationDetail);
        setValue('description', need.description);
        setValue('partnerCount', need.partnerCount);
      });
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const params = { ...data, studyDate: data.studyDate.format('YYYY-MM-DD') };
      if (isEdit) {
        await needApi.update(Number(id), params);
      } else {
        const result = await needApi.create(params);
        localStorage.removeItem('needDraft');
        navigate(`/needs/${result.id}`);
        return;
      }
      navigate('/needs/my');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    const formData = watch();
    localStorage.setItem('needDraft', JSON.stringify({
      ...formData,
      studyDate: formData.studyDate?.format?.('YYYY-MM-DD'),
    }));
    toast.success('草稿已保存');
  };

  useEffect(() => {
    if (!isEdit) {
      const draft = localStorage.getItem('needDraft');
      if (draft) {
        try {
          const data = JSON.parse(draft);
          if (data.title) setValue('title', data.title);
          if (data.courseName) setValue('courseName', data.courseName);
          if (data.studyType) setValue('studyType', data.studyType);
          if (data.studyDate) setValue('studyDate', dayjs(data.studyDate));
          if (data.startTime) setValue('startTime', data.startTime);
          if (data.endTime) setValue('endTime', data.endTime);
          if (data.locationType) setValue('locationType', data.locationType);
          if (data.locationDetail) setValue('locationDetail', data.locationDetail);
          if (data.description) setValue('description', data.description);
          if (data.partnerCount) setValue('partnerCount', data.partnerCount);
        } catch { /* ignore */ }
      }
    }
  }, [isEdit, setValue]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16, color: 'var(--gray-500)' }}>返回</Button>

      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>{isEdit ? '编辑需求' : '发布学习需求'}</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>填写详细信息，找到合适的学习伙伴</p>
      </div>

      <div className="card-elevated">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label={<span style={{ fontWeight: 500 }}>需求标题</span>} required rules={[]} validateStatus={errors.title ? 'error' : ''} help={errors.title?.message as string}>
            <Controller name="title" control={control} render={({ field }) => (
              <Input {...field} placeholder="例如：高数期末复习找搭子" maxLength={50} showCount size="large" />
            )} />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label={<span style={{ fontWeight: 500 }}>课程/科目</span>} required rules={[]} validateStatus={errors.courseName ? 'error' : ''} help={errors.courseName?.message as string}>
              <Controller name="courseName" control={control} render={({ field }) => (
                <Select {...field} showSearch placeholder="搜索或输入课程名" size="large"
                  options={courses.map((c) => ({ label: c, value: c }))}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  onSearch={(v) => { if (v && !courses.includes(v)) setCourses([v, ...courses]); }} />
              )} />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 500 }}>学习类型</span>} required rules={[]} validateStatus={errors.studyType ? 'error' : ''} help={errors.studyType?.message as string}>
              <Controller name="studyType" control={control} render={({ field }) => (
                <Select {...field} placeholder="选择学习类型" size="large"
                  options={Object.entries(STUDY_TYPE_MAP).map(([k, v]) => ({ label: v, value: k }))} />
              )} />
            </Form.Item>
          </div>

          <Form.Item label={<span style={{ fontWeight: 500 }}>学习日期</span>} required validateStatus={errors.studyDate ? 'error' : ''} help={errors.studyDate?.message as string}>
            <Controller name="studyDate" control={control} render={({ field }) => (
              <DatePicker {...field} placeholder="选择日期" size="large" style={{ width: '100%' }}
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                getPopupContainer={(trigger) => trigger.parentElement!} />
            )} />
          </Form.Item>

          <Form.Item label={<span style={{ fontWeight: 500 }}>学习时段</span>} required
            validateStatus={errors.startTime || errors.endTime ? 'error' : ''}
            help={errors.startTime ? (errors.startTime.message as string) : errors.endTime ? (errors.endTime.message as string) : undefined}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Controller name="startTime" control={control} render={({ field }) => (
                <Select {...field} placeholder="开始时间" size="large" style={{ flex: 1 }}
                  showSearch options={TIME_OPTIONS}
                  onChange={(val) => { field.onChange(val); const end = watch('endTime'); if (end && end <= val) setValue('endTime', ''); }} />
              )} />
              <span style={{ color: 'var(--gray-400)', flexShrink: 0 }}>至</span>
              <Controller name="endTime" control={control} render={({ field }) => (
                <Select {...field} placeholder="结束时间" size="large" style={{ flex: 1 }}
                  showSearch options={endTimeOptions} />
              )} />
            </div>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item label={<span style={{ fontWeight: 500 }}>学习地点</span>} required rules={[]} validateStatus={errors.locationType ? 'error' : ''} help={errors.locationType?.message as string}>
              <Controller name="locationType" control={control} render={({ field }) => (
                <Select {...field} placeholder="选择地点类型" size="large"
                  options={Object.entries(LOCATION_TYPE_MAP).map(([k, v]) => ({ label: v, value: k }))} />
              )} />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 500 }}>期望伙伴人数</span>} required rules={[]} validateStatus={errors.partnerCount ? 'error' : ''} help={errors.partnerCount?.message as string}>
              <Controller name="partnerCount" control={control} render={({ field }) => (
                <InputNumber {...field} min={1} max={5} size="large" style={{ width: '100%' }} addonAfter="人" />
              )} />
            </Form.Item>
          </div>

          {locationType === 'OTHER' && (
            <Form.Item label={<span style={{ fontWeight: 500 }}>地点详情</span>}>
              <Controller name="locationDetail" control={control} render={({ field }) => (
                <Input {...field} placeholder="请输入具体地点" maxLength={100} size="large" />
              )} />
            </Form.Item>
          )}

          <Form.Item label={<span style={{ fontWeight: 500 }}>详细描述</span>}>
            <Controller name="description" control={control} render={({ field }) => (
              <Input.TextArea {...field} rows={4} placeholder="描述你的学习计划、期望的伙伴类型等" maxLength={500} showCount style={{ resize: 'none' }} />
            )} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--gray-200)' }}>
            <Button onClick={() => navigate(-1)} size="large">取消</Button>
            <Space>
              {!isEdit && <Button icon={<SaveOutlined />} onClick={saveDraft} size="large">保存草稿</Button>}
              <Button type="primary" htmlType="submit" loading={loading} size="large" icon={<SendOutlined />}>
                {isEdit ? '保存修改' : '发布需求'}
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
}
