import CustomPageModal from '@/components/CustomPageModal';
import {
  deleteCustomPageByPath,
  getCustomPages,
  updateLayoutConfig,
} from '@/services/van-blog/api';
import { ProTable } from '@ant-design/pro-components';
import { Button, Card, message, Modal, Space } from 'antd';
import { useRef } from 'react';
import { Link } from 'umi';
const columns = [
  {
    title: '序号',
    render: (_, record, index) => {
      return index;
    },
  },
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'path', title: '路径' },
  {
    title: '内容',
    render: (text, record, _, action) => {
      return <Link to={`/code?type=customPage&lang=html&path=${record.path}`}>编辑内容</Link>;
    },
  },
  {
    title: '路径',
    render: (text, record, _, action) => {
      return (
        <Space>
          <a key="view" target="_blank" rel="noreferrer" href={`/custom${record.path}`}>
            查看
          </a>

          <CustomPageModal
            key={'editInfo'}
            trigger={<a>修改信息</a>}
            initialValues={record}
            onFinish={() => {
              action?.reload();
            }}
          ></CustomPageModal>

          <a
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '删除确认',
                content: '是否确认删除该自定义页面？',
                onOk: async () => {
                  await deleteCustomPageByPath(record.path);
                  action?.reload();
                  message.success('删除成功！');
                },
              });
            }}
          >
            删除
          </a>
        </Space>
      );
    },
  },
];
export default function () {
  // const [loading, setLoading] = useState(true);
  const actionRef = useRef();

  const handleSave = async () => {
    Modal.confirm({
      title: '保存确认',
      content:
        '在保存前请确认代码的正确性,有问题的代码可能导致前台报错！如不生效，请检查是否在站点配置/布局设置中打开了客制化功能。',
      onOk: async () => {
        setLoading(true);
        try {
          await updateLayoutConfig(values);
          setLoading(false);
          message.success('更新成功！');
        } catch (err) {
          throw err;
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleHelp = () => {
    Modal.info({
      title: '帮助',
      content: (
        <div>
          <p>自定义页面可以添加页面到 /custom 路径下。</p>
          <a
            target="_blank"
            href="https://vanblog.mereith.com/feature/advance/customPage.html"
            rel="noreferrer"
          >
            帮助文档
          </a>
        </div>
      ),
    });
  };

  return (
    <>
      <Card
        className="card-body-full"
        title="自定义页面"
        extra={
          <Space>
            <CustomPageModal
              trigger={<Button type="primary">新建</Button>}
              onFinish={() => {
                actionRef.current?.reload();
                message.success('新建成功！');
              }}
            />
            <Button type="link" key="help" onClick={handleHelp}>
              帮助
            </Button>
          </Space>
        }
      >
        <ProTable
          rowKey="_id"
          columns={columns}
          dateFormatter="string"
          actionRef={actionRef}
          search={false}
          options={false}
          pagination={{
            hideOnSinglePage: true,
            simple: true,
          }}
          request={async (params = {}) => {
            let { data } = await getCustomPages();
            return {
              data,
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: true,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: data.length,
            };
          }}
        />
      </Card>
    </>
  );
}
