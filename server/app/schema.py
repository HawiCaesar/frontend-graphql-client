import graphene
import graphene_django_optimizer as gql_optimizer  # noqa
from django.contrib.auth.models import User
from graphene import ObjectType, relay
from graphene_django.filter import DjangoFilterConnectionField
# from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_django.types import DjangoObjectType

from . import models, serializers  # noqa


################################################################################
#
#  Apollo schema
#
################################################################################

class UserType(DjangoObjectType):
    class Meta:
        model = User


class StoreType(DjangoObjectType):
    class Meta:
        model = models.Store


class ProductType(DjangoObjectType):
    class Meta:
        model = models.Product


class OrderType(DjangoObjectType):
    class Meta:
        model = models.Order


class OrderItemType(DjangoObjectType):
    class Meta:
        model = models.OrderItem


class ApolloQuery(graphene.ObjectType):
    all_stores = graphene.List(StoreType)
    all_products = graphene.List(ProductType)
    all_orders = graphene.List(OrderType)
    all_order_items = graphene.List(OrderItemType)

    def resolve_all_stores(self, info):
        return gql_optimizer.query(models.Store.objects.all(), info)

    def resolve_all_products(self, info):
        return gql_optimizer.query(models.Product.objects.all(), info)

    def resolve_all_orders(self, info):
        return gql_optimizer.query(models.Order.objects.all(), info)

    def resolve_all_order_items(self, info):
        return gql_optimizer.query(models.OrderItem.objects.all(), info)


apollo_schema = graphene.Schema(query=ApolloQuery)


################################################################################
#
#  Relay schema
#
################################################################################

class UserNode(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = (
                'password',
                )
        filter_fields = {
                'first_name': ['contains'],
                }
        interfaces = (relay.Node,)


class StoreNode(DjangoObjectType):
    class Meta:
        model = models.Store
        filter_fields = {
                'name': ['contains'],
                }
        interfaces = (relay.Node,)


class ProductNode(DjangoObjectType):
    class Meta:
        model = models.Product
        filter_fields = {
                'store': ['exact'],
                }
        interfaces = (relay.Node,)


class OrderNode(DjangoObjectType):
    class Meta:
        model = models.Order
        filter_fields = {}
        interfaces = (relay.Node,)


class OrderItemNode(DjangoObjectType):
    class Meta:
        model = models.OrderItem
        filter_fields = {}
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    user = relay.Node.Field(UserNode)
    all_users = DjangoFilterConnectionField(UserNode)

    store = relay.Node.Field(StoreNode)
    all_stores = DjangoFilterConnectionField(StoreNode)

    product = relay.Node.Field(ProductNode)
    all_products = DjangoFilterConnectionField(ProductNode)

    order = relay.Node.Field(OrderNode)
    all_orders = DjangoFilterConnectionField(OrderNode)

    order_item = relay.Node.Field(OrderItemNode)
    all_order_items = DjangoFilterConnectionField(OrderItemNode)


class CreateProductMutation(relay.ClientIDMutation):
    class Input:
        store_id = graphene.ID(required=True)
        name = graphene.String(required=True)
        price = graphene.Float(required=True)

    product = graphene.Field(ProductNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **data):
        store = graphene.Node.get_node_from_global_id(info, data['store_id'])
        product = models.Product.objects.create(
                store=store,
                name=data['name'],
                price=data['price'],
                )
        return CreateProductMutation(product=product)


class Mutation(ObjectType):
    add_product_to_store = CreateProductMutation.Field()


relay_schema = graphene.Schema(query=Query, mutation=Mutation)
