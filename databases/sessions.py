from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

engine = create_engine("sqlite:///chat-teacher.db", echo=True)
Base = declarative_base()


class Chat(Base):
    __tablename__ = "chat"

    id = Column(Integer, primary_key=True)
    uuid = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)

    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    role = Column(String, nullable=False)
    chat_id = Column(Integer, ForeignKey("chat.id"), nullable=False)  # Está ok
    content = Column(String, nullable=False)

    chat = relationship("Chat", back_populates="messages")

# Create the database tables
Base.metadata.create_all(engine)

def get_db():
    """Get a database session."""
    Session = sessionmaker(bind=engine)
    return Session()
